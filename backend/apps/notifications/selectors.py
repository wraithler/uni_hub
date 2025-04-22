from django.db.models import QuerySet
from apps.notifications.models import Notification
from apps.users.models import BaseUser

def user_notifications_get(user):
    """
    Returns all notifications for a specific user.
    """
    return Notification.objects.filter(recipient=user).order_by("-created_at")

# Alias for backward compatibility and tests
def get_user_notifications(user: BaseUser) -> QuerySet[Notification]:
    """
    Alias for user_notifications_get for backward compatibility.
    """
    return user_notifications_get(user)

def get_unread_notifications(user: BaseUser) -> QuerySet[Notification]:
    """
    Returns unread notifications for a specific user.
    """
    return Notification.objects.filter(recipient=user, is_read=False).order_by("-created_at")

def user_has_unread_notifications(user: BaseUser) -> bool:
    """
    Returns True if the user has any unread notifications.
    """
    return Notification.objects.filter(recipient=user, is_read=False).exists()

def list_all_notifications() -> QuerySet[Notification]:
    """
    Returns a queryset of all notifications in the system.
    """
    return Notification.objects.select_related("recipient").all()