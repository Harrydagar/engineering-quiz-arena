from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from rest_framework import status

from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .models import UserProfile
from .serializers import RegisterSerializer
from .throttles import (
    LoginThrottle,
    RefreshThrottle,
    RegisterThrottle,
)

from .utils import send_verification_email


from .auth_serializers import (
    CustomTokenObtainPairSerializer
)

from .password_serializers import (
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    ChangePasswordSerializer,
    ResendVerificationSerializer
)

from .utils import send_password_reset_email

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegisterThrottle]

    def perform_create(self, serializer):
        user = serializer.save()
        send_verification_email(user, self.request)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(
                urlsafe_base64_decode(uidb64)
            )

            user = User.objects.get(pk=uid)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {
                    "detail": "Invalid verification link."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if default_token_generator.check_token(
            user,
            token,
        ):
            user.is_active = True
            user.save()

            return Response(
                {
                    "detail": "Email verified successfully."
                }
            )

        return Response(
            {
                "detail": "Verification link has expired or is invalid."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(
            user=request.user
        )

        return Response(
            {
                "username": request.user.username,
                "email": request.user.email,
                "rating": profile.rating,
                "highest_rating": profile.highest_rating,
                "current_streak": profile.current_streak,
                "longest_streak": profile.longest_streak,
            }
        )


class LoginView(TokenObtainPairView):
    serializer_class = (
        CustomTokenObtainPairSerializer
    )

    throttle_classes = [LoginThrottle]

class CustomTokenRefreshView(TokenRefreshView):
    throttle_classes = [RefreshThrottle]

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        user = User.objects.filter(
            email__iexact=email
        ).first()

        if user:
            send_password_reset_email(
                user,
                request,
            )

        return Response(
            {
                "detail":
                "If an account exists with this email, a password reset link has been sent."
            }
        )

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(
                urlsafe_base64_decode(uidb64)
            )

            user = User.objects.get(pk=uid)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {
                    "detail": "Invalid reset link."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {
                    "detail": "Reset link is invalid or has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ResetPasswordSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        user.set_password(
            serializer.validated_data["password"]
        )
        user.save()

        return Response(
            {
                "detail": "Password reset successfully."
            }
        )
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        if not request.user.check_password(
            serializer.validated_data[
                "old_password"
            ]
        ):
            return Response(
                {
                    "detail":
                    "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(
            serializer.validated_data[
                "password"
            ]
        )

        request.user.save()

        return Response(
            {
                "detail":
                "Password changed successfully."
            }
        )
    
class ResendVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendVerificationSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]

        user = User.objects.filter(
            email__iexact=email
        ).first()

        if user and not user.is_active:
            send_verification_email(
                user,
                request,
            )

        return Response(
            {
                "detail":
                "If an inactive account exists, a verification email has been sent."
            }
        )