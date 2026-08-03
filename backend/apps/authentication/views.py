from rest_framework import status, views, permissions, generics
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import get_user_model

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)
from .services import AuthService

User = get_user_model()

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth_sensitive'

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = AuthService.register_user(serializer.validated_data, request)
            tokens = AuthService.generate_tokens_for_user(user)
            user_serializer = UserProfileSerializer(user)

            return Response({
                'message': 'User registered successfully. Verification email sent.',
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth_sensitive'

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = AuthService.generate_tokens_for_user(user)
            user_serializer = UserProfileSerializer(user)

            ip = request.META.get('REMOTE_ADDR')
            agent = request.META.get('HTTP_USER_AGENT')
            AuthService.log_audit_action(user, 'USER_LOGGED_IN', ip_address=ip, user_agent=agent)

            return Response({
                'message': 'Login successful.',
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            ip = request.META.get('REMOTE_ADDR')
            agent = request.META.get('HTTP_USER_AGENT')
            AuthService.log_audit_action(request.user, 'USER_LOGGED_OUT', ip_address=ip, user_agent=agent)

            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Invalid or expired refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class PasswordResetRequestView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth_sensitive'

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user, token = AuthService.request_password_reset(email, request)
            if user and token:
                return Response({
                    'message': 'Password reset link sent to your registered email address.',
                    'token': token  # Included for development demonstration
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'If an account exists for this email, password reset instructions have been sent.'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth_sensitive'

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            new_password = serializer.validated_data['new_password']
            token = serializer.validated_data['token']
            AuthService.reset_password(user, new_password, token, request)

            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(SimpleJWTTokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            AuthService.log_audit_action(None, 'JWT_TOKEN_REFRESHED', ip_address=request.META.get('REMOTE_ADDR'))
        return response
