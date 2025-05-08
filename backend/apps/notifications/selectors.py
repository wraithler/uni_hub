from django.db.models import Q
from .models import Notification


def notification_list_by_user(*, user):
    """
    Get all notifications for a user.
    """
    return Notification.objects.filter(recipient=user).order_by("-created_at")


def notification_list_unread_by_user(*, user):
    """
    Get all unread notifications for a user.
    """
    return Notification.objects.filter(recipient=user, is_read=False).order_by(
        "-created_at"
    )


def notification_get(*, user, notification_id):
    """
    Get a specific notification for a user.
    """
    try:
        return Notification.objects.get(recipient=user, id=notification_id)
    except Notification.DoesNotExist:
        return None


def notification_count(*, user):
    """
    Count unread notifications for a user.
    """
    return Notification.objects.filter(recipient=user, is_read=False).count()
