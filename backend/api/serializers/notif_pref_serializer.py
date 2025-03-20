from rest_framework import serializers
from api.models import UserNotificationPreference

class UserNotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotificationPreference
        fields = [
            "subscribed_communities",
            "event_updates",
            "post_notifications",
            "announcements",
            "email_notifications",
            "in_app_notifications",
        ]
        extra_kwargs = {
            "subscribed_communities": {"required": False},
            "event_updates": {"required": False},
            "post_notifications": {"required": False},
            "announcements": {"required": False},
            "email_notifications": {"required": False},
            "in_app_notifications": {"required": False},
        }