from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.template.loader import render_to_string
from typing import List, Optional
from .models import Notification
from apps.notification_preferences.models import UserNotificationPreference
from apps.emails.models import Email
from apps.emails.services import email_send
from apps.emails.tasks import email_send as email_send_task

def get_user_preferences(user):
    """
    Get user's notification preferences.
    """
    try:
        return user.notification_preferences
    except UserNotificationPreference.DoesNotExist:
        return None

def should_send_notification(user, notification_type: str, channel: str) -> bool:
    """
    Check if notification should be sent based on user preferences.
    """
    preferences = get_user_preferences(user)
    if not preferences:
        return True  # Default to True if no preferences

    # Map notification types to preference fields
    type_to_preference = {
        'post': 'post_notifications',
        'event': 'event_updates',
        'announcement': 'announcements',
    }

    # Check if user has  this type of notification
    if notification_type in type_to_preference:
        if not getattr(preferences, type_to_preference[notification_type], True):
            return False

    # Check if user has  this channel
    if channel == 'email' and not preferences.email_notifications:
        return False
    if channel == 'in_app' and not preferences.in_app_notifications:
        return False

    return True

def send_notification_email(notification: Notification) -> Email:
    """
    Send a notification via email using the notification template.
    """
    # Render the email template
    html = render_to_string(
        "notifications/email/notification.html",
        {"notification": notification}
    )
    
    # Create email record
    email = Email.objects.create(
        to=notification.recipient.email,
        subject=notification.title,
        html=html,
        plain_text=notification.message,
        status=Email.Status.SENDING,
    )
    
    # Send email asynchronously
    email_send_task.delay(email.id)
    
    return email

def notification_create(*, 
        recipient, 
        notification_type, 
        message, 
        title=None, 
        content_object=None, 
        channel='in_app'):
    """
    Create a notification
    """
    # Check user preferences before creating
    if not should_send_notification(recipient, notification_type, channel):
        return None
    
    # Prepare notification data
    notification_data = {
        'recipient': recipient,
        'title': title or message[:50] + ('...' if len(message) > 50 else ''),
        'message': message,
        'notification_type': notification_type,
        'channel': channel,
        'status': 'sent',
    }
    
    # Add content object data if provided
    if content_object:
        notification_data['content_type'] = ContentType.objects.get_for_model(content_object)
        notification_data['object_id'] = content_object.id
    
    # Create notification
    notification = Notification.objects.create(**notification_data)
    
    # Send email if channel is email
    if channel == 'email':
        send_notification_email(notification)
    
    return notification

def notification_create_batch(
    *,
    recipient,
    notification_type: str,
    content_object,
    message: str,
    title: Optional[str] = None,
    channels: List[str] = None,
) -> List[Notification]:
    """
    Create one or more notifications for a recipient across multiple channels.
    """
    if channels is None:
        channels = ['in_app']
    
    content_type = ContentType.objects.get_for_model(content_object)
    
    notifications = []
    for channel in channels:
        # if user preferences don't allow this notification
        if not should_send_notification(recipient, notification_type, channel):
            continue
            
        notification = Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            content_type=content_type,
            object_id=content_object.id,
            title=title or (message[:50] + '...' if len(message) > 50 else message),
            message=message,
            channel=channel
        )
        notifications.append(notification)
    
    return notifications

def notification_mark_as_read(*, notification_id):
    """
    Mark a notification as read
    """
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.mark_as_read()
        return True
    except Notification.DoesNotExist:
        return False

def notification_mark_all_as_read(*, user):
    """
    Mark all notifications as read for a user
    """
    now = timezone.now()
    count = Notification.objects.filter(recipient=user, is_read=False).update(
        is_read=True, read_at=now
    )
    return count > 0

def notification_delete(*, notification_id):
    """
    Delete a notification
    """
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.delete()
        return True
    except Notification.DoesNotExist:
        return False

def notification_delete_all(*, user):
    """
    Delete all notifications for a user
    """
    deleted_count = Notification.objects.filter(recipient=user).delete()[0]
    return deleted_count > 0