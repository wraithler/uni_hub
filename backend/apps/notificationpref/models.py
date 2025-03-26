from django.db import models
from apps.users.models import BaseUser
from apps.communities.models import Community

class UserNotificationPreference(models.Model):
    user = models.OneToOneField(BaseUser, on_delete=models.CASCADE, related_name="notification_preferences")
    subscribed_communities = models.ManyToManyField(Community, blank=True)
    event_updates = models.BooleanField(default=True)
    post_notifications = models.BooleanField(default=True)
    announcements = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    in_app_notifications = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification_preference'

    def __str__(self):
        return f"Notification Preferences for {self.user.username}"