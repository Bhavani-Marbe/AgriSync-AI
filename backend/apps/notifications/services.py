import logging
from .models import Notification

logger = logging.getLogger('apps.notifications')

class NotificationService:
    @staticmethod
    def send_notification(user, title, message, notification_type='SYSTEM'):
        logger.info(f"Dispatching notification [{notification_type}] to User {user.email}")
        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type
        )

    @staticmethod
    def seed_default_notifications_if_empty(user):
        if not Notification.objects.filter(user=user).exists():
            Notification.objects.create(
                user=user,
                title="Monsoon Rain Alert",
                message="Monsoon showers expected on Monday in Kalaburagi (85% probability, ~45mm). Delay urea top-dressing.",
                notification_type="WEATHER"
            )
            Notification.objects.create(
                user=user,
                title="APMC Tur Price Surge",
                message="Tur prices up +3.2% in APMC Kalaburagi market exchange (Rs. 7,850/Quintal).",
                notification_type="MARKET"
            )
