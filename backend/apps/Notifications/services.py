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
