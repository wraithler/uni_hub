import django_filters
from apps.notificationpref.models import UserNotificationPreference

class UserNotificationPreferenceFilter(django_filters.FilterSet):
    class Meta:
        model = UserNotificationPreference
        fields = (
            "user__username",
            "event_updates",
            "post_notifications",
            "announcements",
            "email_notifications",
            "in_app_notifications",
        )