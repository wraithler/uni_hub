from django.db import transaction
from .models import Notification



def create_notification(user, notification_type, content, is_important=False):
    
    notification = Notification(
        user=user,
        notification_type=notification_type,
        content=content,
        is_important=is_important,
    )
    notification.save()
    return notification



def mark_notification_as_read(notification):
    
    notification.is_read = True
    notification.save()
    return notification



def mark_all_notifications_as_read(user):
    
    notifications = Notification.objects.filter(user=user, is_read=False)
    notifications.update(is_read=True)
    return notifications



def mark_notification_as_important(notifica
