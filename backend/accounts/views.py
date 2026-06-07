from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.userprofile

        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "rating": profile.rating,
            "highest_rating": profile.highest_rating,
            "current_streak": profile.current_streak,
            "longest_streak": profile.longest_streak
        })