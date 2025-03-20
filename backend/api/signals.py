from django.db.models.signals import post_save
from django.dispatch import receiver
from api.models import User, UserNotificationPreference

@receiver(post_save, sender=User)
def create_user_notification_preferences(sender, instance, created, **kwargs):
    if created: 
        UserNotificationPreference.objects.create(user=instance)