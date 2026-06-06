from django.contrib.auth.models import User
from rest_framework import generics
from django.http import HttpResponse
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })    
    

    def create_admin(request):
        User = get_user_model()

        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                email="your_email@example.com",
                password="StrongPassword123!"
            )
            return HttpResponse("Superuser created")

        return HttpResponse("Superuser already exists")    