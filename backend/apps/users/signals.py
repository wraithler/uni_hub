from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser

@receiver(post_save, sender=BaseUser)
def create_user_notification_preferences(sender, instance, created, **kwargs):
    if created:
        UserNotificationPreference.objects.create(
            user=instance,
            event_updates=True,
            post_notifications=True,
            announcements=True,
            email_notifications=True,
            in_app_notifications=True
        )