from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def send_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    token = default_token_generator.make_token(user)

    verification_url = (
        f"{settings.FRONTEND_URL}"
        f"/verify-email/{uid}/{token}"
    )

    send_mail(
        subject="Verify your Engineering Quiz Arena account",
        message=(
            f"Hi {user.username},\n\n"
            f"Please verify your account by clicking the link below:\n\n"
            f"{verification_url}\n\n"
            "If you did not create this account, you can ignore this email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )

def send_password_reset_email(user, request):
    uid = urlsafe_base64_encode(
        force_bytes(user.pk)
    )

    token = default_token_generator.make_token(user)

    reset_url = (
        f"{settings.FRONTEND_URL}"
        f"/reset-password/{uid}/{token}"
    )

    send_mail(
        subject="Reset your Engineering Quiz Arena password",
        message=(
            f"Hi {user.username},\n\n"
            "We received a request to reset your password.\n\n"
            f"Click the link below to continue:\n\n"
            f"{reset_url}\n\n"
            "If you didn't request this, you can safely ignore this email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )