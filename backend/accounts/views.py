from django.contrib.auth.models import User

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


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegisterThrottle]


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
    throttle_classes = [LoginThrottle]


class CustomTokenRefreshView(TokenRefreshView):
    throttle_classes = [RefreshThrottle]