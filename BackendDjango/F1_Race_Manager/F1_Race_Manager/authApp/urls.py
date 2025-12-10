from .views import SignUpView, ProfileView  
from django.urls import path
from django.views.generic.base import TemplateView
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView, PasswordChangeDoneView 


# Nouvelles API views (pour React)
from .api_views import (
    RegisterAPIView,
    LoginAPIView,
    LogoutAPIView,
    UserProfileAPIView,
    ChangePasswordAPIView,
    RefreshTokenAPIView
)
urlpatterns = [
path('signup/', SignUpView.as_view(), name='signup'),  
path('authApp/logout/', LogoutView.as_view(), name='logout'),

path('', TemplateView.as_view(template_name='home.html'), name='home'),

#path('auth/', include('django.contrib.auth.urls')), # this includes login,
path('profile/', ProfileView.as_view(), name='profile'),
path('login/', LoginView.as_view(template_name='registration/login.html'), name='login'),
path('logout/', LogoutView.as_view(), name='logout'),
path('change-password/', PasswordChangeView.as_view(template_name='registration/change_password.html'), name='change_password'),
path('change-password/done/', PasswordChangeDoneView.as_view(template_name='registration/password_changed.html'), name='password_change_done'),

# NOUVELLES ROUTES API (pour React) - AJOUTÉES
path('api/register/', RegisterAPIView.as_view(), name='api_register'),
path('api/login/', LoginAPIView.as_view(), name='api_login'),
path('api/logout/', LogoutAPIView.as_view(), name='api_logout'),
path('api/profile/', UserProfileAPIView.as_view(), name='api_profile'),
path('api/change-password/', ChangePasswordAPIView.as_view(), name='api_change_password'),
path('api/token/refresh/', RefreshTokenAPIView.as_view(), name='api_token_refresh'),

]
