import logging
from typing import List, Optional, Dict, Any
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.notifications.models import Notification
from apps.users.models import BaseUser
from apps.events.models import Event
from apps.notification_preferences.models import UserNotificationPreference

logger = logging.getLogger(__name__)

class NotificationServiceError(Exception):
    """Base exception for notification service errors"""
    pass

class InvalidNotificationTypeError(NotificationServiceError):
    """Raised when an invalid notification type is provided"""
    pass

class NotificationCreationError(NotificationServiceError):
    """Raised when notification creation fails"""
    pass

def notification_validate_type(notification_type: str) -> None:
    """
    Validate that the notification type is valid.
    """
    if notification_type not in Notification.NotificationType.values:
        raise InvalidNotificationTypeError(
            f"Invalid notification type: {notification_type}. "
            f"Must be one of: {', '.join(Notification.NotificationType.values)}"
        )

@transaction.atomic
def notification_create(
    *,
    recipient: BaseUser,
    message: str,
    notification_type: str,
    is_read: bool = False
) -> Notification:
    """
    Create a new notification for a user.
    """
    try:
        notification_validate_type(notification_type)
        notification = Notification.objects.create(
            recipient=recipient,
            message=message,
            notification_type=notification_type,
            is_read=is_read
        )
        logger.info(
            f"Notification created: id={notification.id}, "
            f"recipient={recipient.email}, "
            f"type={notification_type}, "
            f"message={message}"
        )
        return notification
    except ValidationError as e:
        logger.error(f"Validation error creating notification: {str(e)}")
        raise NotificationCreationError(f"Failed to create notification: {str(e)}")
    except InvalidNotificationTypeError:
        # Re-raise the InvalidNotificationTypeError without wrapping it
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating notification: {str(e)}")
        raise NotificationCreationError(f"Failed to create notification: {str(e)}")

@transaction.atomic
def notification_update(
    *,
    notification: Notification, 
    **kwargs
) -> Notification:
    """
    Update fields on a notification instance.
    """
    for field, value in kwargs.items():
        setattr(notification, field, value)
    notification.save(update_fields=kwargs.keys())
    return notification

@transaction.atomic
def notification_mark_as_read(notification: Notification) -> Notification:
    """
    Mark a notification as read.
    """
    try:
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        
        logger.info(f"Notification {notification.id} marked as read")
        
        return notification
        
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        raise NotificationServiceError(f"Failed to mark notification as read: {str(e)}")

def notification_get_event_recipients(event: Event) -> List[BaseUser]:
    """
    Get all users who should receive notifications for an event based on their preferences.
    """
    try:
        # Get all community members with enabled notification preferences
        recipients = BaseUser.objects.filter(
            memberships__community=event.community,
            notification_preferences__event_updates=True,
            notification_preferences__in_app_notifications=True
        ).distinct()
        
        logger.info(
            f"Found {recipients.count()} potential recipients for event {event.id} "
            f"in community {event.community.id}"
        )
        
        return list(recipients)
        
    except Exception as e:
        logger.error(f"Error getting event notification recipients: {str(e)}")
        return []

def notification_create_for_event(
    *,
    event: Event,
    recipient: BaseUser,
    notification_type: str = Notification.NotificationType.INFO,
    is_update: bool = False,
    additional_info: Optional[Dict[str, Any]] = None
) -> Optional[Notification]:
    """
    Create a notification for an event with detailed information.
    """
    try:
        # Get event details
        event_details = {
            "title": event.title,
            "description": event.description,
            "starts_at": event.starts_at.strftime("%Y-%m-%d %H:%M"),
            "ends_at": event.ends_at.strftime("%Y-%m-%d %H:%M"),
            "location": event.location,
            "is_virtual": event.is_virtual_event,
            "community": event.community.name,
            **(additional_info or {})
        }
        
        # Create message based on notification type
        if is_update:
            message = (
                f"Event '{event.title}' has been updated:\n"
                f"• New time: {event_details['starts_at']} - {event_details['ends_at']}\n"
                f"• Location: {event_details['location']}\n"
                f"• Community: {event_details['community']}"
            )
        else:
            message = (
                f"New event '{event.title}' in {event_details['community']}:\n"
                f"• Time: {event_details['starts_at']} - {event_details['ends_at']}\n"
                f"• Location: {event_details['location']}\n"
                f"• Description: {event_details['description']}"
            )
        
        # Add additional info to message if provided
        if additional_info:
            message += "\n• Additional Info:"
            for key, value in additional_info.items():
                message += f"\n  - {key}: {value}"
        
        # Create and log the notification
        notification = notification_create(
            recipient=recipient,
            message=message,
            notification_type=notification_type
        )
        
        logger.info(
            f"Event notification created: event_id={event.id}, "
            f"recipient={recipient.email}, "
            f"type={notification_type}, "
            f"is_update={is_update}"
        )
        
        return notification
        
    except Exception as e:
        logger.error(f"Error creating event notification: {str(e)}")
        return None

def notification_get_user_unread(user: BaseUser) -> List[Notification]:
    """
    Get all unread notifications for a user.
    """
    try:
        notifications = Notification.objects.filter(
            recipient=user,
            is_read=False
        ).order_by("-created_at")
        
        logger.info(f"Found {notifications.count()} unread notifications for user {user.email}")
        
        return list(notifications)
        
    except Exception as e:
        logger.error(f"Error getting user unread notifications: {str(e)}")
        return []