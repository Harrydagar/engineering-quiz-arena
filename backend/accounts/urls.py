from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    LoginView,
    CustomTokenRefreshView,
    VerifyEmailView,
    ForgotPasswordView,
    ResetPasswordView,
    ChangePasswordView,
    ResendVerificationView
)

from .views import RegisterView, ProfileView
urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    
    path('register/', RegisterView.as_view(), name='register'),

    path('token/', LoginView.as_view(), name='token_obtain_pair'),

    path(
        'token/refresh/',
        CustomTokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path(
        "verify-email/<uidb64>/<token>/",
        VerifyEmailView.as_view(),
        name="verify-email",
    ),

    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password",
    ),

    path(
        "reset-password/<uidb64>/<token>/",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    path(
        "resend-verification/",
        ResendVerificationView.as_view(),
        name="resend-verification",
    ),
    
]