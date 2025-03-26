from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.communities.models import Community

def notification_preference_create(
    *, user: BaseUser, subscribed_communities: list = [], event_updates: bool = True,
    post_notifications: bool = True, announcements: bool = True, email_notifications: bool = True,
    in_app_notifications: bool = True
) -> UserNotificationPreference:
    
    preference, created = UserNotificationPreference.objects.get_or_create(
        user=user,
        defaults={
            "event_updates": event_updates,
            "post_notifications": post_notifications,
            "announcements": announcements,
            "email_notifications": email_notifications,
            "in_app_notifications": in_app_notifications,
        }
    )

    if created or subscribed_communities:
        preference.subscribed_communities.set(subscribed_communities)
        preference.save()

    return preference

def notification_preference_update(*, user: BaseUser, data: dict) -> UserNotificationPreference:
    
    preference, created = UserNotificationPreference.objects.get_or_create(user=user)
    

    allowed_fields = {
        "event_updates",
        "post_notifications",
        "announcements",
        "email_notifications",
        "in_app_notifications",
        "subscribed_communities",
    }
    
    for field, value in data.items():
        if field in allowed_fields:
            if field == "subscribed_communities" and isinstance(value, list):
                preference.subscribed_communities.set(value)
            else:
                setattr(preference, field, value)
    
    preference.save()
    return preference
