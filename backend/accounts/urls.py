from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    LoginView,
    CustomTokenRefreshView,
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
]