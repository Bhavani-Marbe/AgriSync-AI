from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    CustomTokenRefreshView,
)

app_name = 'authentication'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserProfileView.as_view(), name='profile'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('password/reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
