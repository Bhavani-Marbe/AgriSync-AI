import uuid
import logging
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from apps.audit.models import AuditLog
from .models import PasswordResetToken, EmailVerificationToken

logger = logging.getLogger('apps.authentication')
User = get_user_model()

class AuthService:
    @staticmethod
    def generate_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['full_name'] = user.full_name

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @staticmethod
    def log_audit_action(user, action, ip_address=None, user_agent=None, details=None):
        AuditLog.objects.create(
            user=user if user and user.is_authenticated else None,
            user_email=user.email if user else 'Anonymous',
            action=action,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details or {}
        )
        logger.info(f"Audit Action [{action}] for User [{user.email if user else 'Anonymous'}]")

    @staticmethod
    def register_user(validated_data, request=None):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'FARMER'),
            phone_number=validated_data.get('phone_number', ''),
            organization_name=validated_data.get('organization_name', '')
        )

        # Generate Email Verification Token
        verify_token = uuid.uuid4().hex
        EmailVerificationToken.objects.create(
            user=user,
            token=verify_token,
            expires_at=timezone.now() + timedelta(hours=48)
        )

        # Send welcome/verification email
        try:
            send_mail(
                subject='Welcome to AgriSync AI - Verify Email',
                message=f'Hello {user.first_name},\n\nWelcome to AgriSync. Your email verification token is: {verify_token}',
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@agrisync.io'),
                recipient_list=[user.email],
                fail_silently=True
            )
        except Exception as e:
            logger.error(f"Failed to dispatch registration email to {user.email}: {e}")

        ip = request.META.get('REMOTE_ADDR') if request else None
        agent = request.META.get('HTTP_USER_AGENT') if request else None
        AuthService.log_audit_action(user, 'USER_REGISTERED', ip_address=ip, user_agent=agent)

        return user

    @staticmethod
    def request_password_reset(email, request=None):
        try:
            user = User.objects.get(email=email)
            token_str = uuid.uuid4().hex
            
            # Invalidate older unused reset tokens
            PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

            reset_obj = PasswordResetToken.objects.create(
                user=user,
                token=token_str,
                expires_at=timezone.now() + timedelta(hours=2)
            )

            # Send Password Reset Email
            send_mail(
                subject='AgriSync AI Password Reset Request',
                message=f'Hello {user.first_name},\n\nUse code {token_str} to reset your password.',
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@agrisync.io'),
                recipient_list=[user.email],
                fail_silently=True
            )

            ip = request.META.get('REMOTE_ADDR') if request else None
            agent = request.META.get('HTTP_USER_AGENT') if request else None
            AuthService.log_audit_action(user, 'PASSWORD_RESET_REQUESTED', ip_address=ip, user_agent=agent)
            return user, reset_obj.token
        except User.DoesNotExist:
            return None, None

    @staticmethod
    def reset_password(user, new_password, token_str, request=None):
        reset_obj = PasswordResetToken.objects.filter(user=user, token=token_str, is_used=False).first()
        if not reset_obj or not reset_obj.is_valid():
            raise ValueError("Invalid or expired password reset token.")

        user.set_password(new_password)
        user.save(update_fields=['password'])

        reset_obj.is_used = True
        reset_obj.save(update_fields=['is_used'])

        ip = request.META.get('REMOTE_ADDR') if request else None
        agent = request.META.get('HTTP_USER_AGENT') if request else None
        AuthService.log_audit_action(user, 'PASSWORD_RESET_COMPLETED', ip_address=ip, user_agent=agent)
        return user
