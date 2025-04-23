from django.db.models import QuerySet
from apps.notifications.models import Notification
from apps.users.models import BaseUser

def notification_list_by_user(user: BaseUser) -> QuerySet[Notification]:
    """
    Returns all notifications for a specific user.
    """
    return Notification.objects.filter(recipient=user).order_by("-created_at")

def notification_list_unread_by_user(user: BaseUser) -> QuerySet[Notification]:
    """
    Returns unread notifications for a specific user.
    """
    return Notification.objects.filter(recipient=user, is_read=False).order_by("-created_at")

def notification_has_unread_by_user(user: BaseUser) -> bool:
    """
    Returns True if the user has any unread notifications.
    """
    return Notification.objects.filter(recipient=user, is_read=False).exists()

def notification_list_all() -> QuerySet[Notification]:
    """
    Returns a queryset of all notifications in the system.
    """
    return Notification.objects.select_related("recipient").all()

def notification_get(*, user: BaseUser, notification_id: int) -> Notification:
    """
    Returns a specific notification for a user.
    """
    try:
        return Notification.objects.get(id=notification_id, recipient=user)
    except Notification.DoesNotExist:
        return None