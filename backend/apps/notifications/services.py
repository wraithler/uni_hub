from typing import List
from django.db import transaction
from apps.notifications.models import Notification
from apps.users.models import BaseUser

@transaction.atomic
def notification_create(
    *,
    recipient: BaseUser,
    message: str,
    notification_type: str,
    is_read: bool = False,
) -> Notification:
    """
    Create a new notification for a user.
    """
    notification = Notification.objects.create(
        recipient=recipient,
        message=message,
        notification_type=notification_type,
        is_read=is_read,
    )
    return notification

@transaction.atomic
def mark_notification_as_read(notification):
    """
    Marks a notification as read.
    
    Args:
        notification: The notification object to mark as read
        
    Returns:
        Notification: The updated notification object
    """
    notification.is_read = True
    notification.save(update_fields=['is_read'])
    
    return notification