from django.contrib.auth.models import User

from rest_framework import serializers

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
)


class CustomTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

    @classmethod
    def get_token(cls, user):
        return super().get_token(user)

    def validate(self, attrs):

        username = attrs.get("username")

        try:
            user = User.objects.get(
                username=username
            )

            if not user.is_active:
                raise serializers.ValidationError(
                    {
                        "detail":
                        "Please verify your email before logging in."
                    }
                )

        except User.DoesNotExist:
            pass

        return super().validate(attrs)