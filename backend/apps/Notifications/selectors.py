from django.db.models import QuerySet
from apps.notification_preferences.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.common.utils import get_object


def get_user_notification_preferences(user: BaseUser) -> UserNotificationPreference:
    """
    Retrieves the notification preferences for a specific user.
    Raises an exception if the user does not have preferences set.
    """
    return get_object(UserNotificationPreference, user=user)


def list_all_notification_preferences() -> QuerySet[UserNotificationPreference]:
    """
    Returns a queryset of all users' notification preferences.
    Useful for sending system-wide notifications or audits.
    """
    return UserNotificationPreference.objects.select_related("user").all()


def user_allows_notification(user: BaseUser, notification_type: str) -> bool:
    """
    Checks if a user allows a specific type of notification.
    `notification_type` can be 'email', 'sms', 'push', etc.
    """
    preference = get_user_notification_preferences(user)

    
    return getattr(preference, f"allow_{notification_type}", False)
