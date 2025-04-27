from django.test import TestCase
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.notifications.models import Notification
from apps.notifications.services import (
    notification_create,
    get_event_notification_recipients,
    create_event_notification,
    notification_mark_as_read,
    get_user_unread_notifications,
    InvalidNotificationTypeError,
    NotificationCreationError,
    NotificationServiceError
)
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.events.factories import EventFactory
from apps.notification_preferences.factories import UserNotificationPreferenceFactory
from apps.notification_preferences.models import UserNotificationPreference
from apps.communities.models import CommunityMembership

class NotificationServicesTests(TestCase):
    def setUp(self):
        # Create test users
        self.user1 = BaseUserFactory.create()
        self.user2 = BaseUserFactory.create()
        self.user3 = BaseUserFactory.create()
        
        # Create a community
        self.community = CommunityFactory.create()
        
        # Add members to the community
        CommunityMembership.objects.create(user=self.user1, community=self.community)
        CommunityMembership.objects.create(user=self.user2, community=self.community)
        CommunityMembership.objects.create(user=self.user3, community=self.community)
        
        # to ensure they are set correctly
        # to  make sure any existing preferences are removed
        UserNotificationPreference.objects.filter(user__in=[self.user1, self.user2, self.user3]).delete()
        
        # create with correct values
        self.pref1 = UserNotificationPreference.objects.create(
            user=self.user1,
            event_updates=True,
            in_app_notifications=True
        )
        
        self.pref2 = UserNotificationPreference.objects.create(
            user=self.user2,
            event_updates=True,
            in_app_notifications=True
        )
        
        self.pref3 = UserNotificationPreference.objects.create(
            user=self.user3,
            event_updates=False,  # This user should not receive event notifications
            in_app_notifications=True
        )
        
        # Create an event
        self.event = EventFactory.create(
            created_by=self.user1,
            community=self.community
        )
    
    def test_notification_create_success(self):
        """Test successful notification creation"""
        notification = notification_create(
            recipient=self.user1,
            message="Test notification",
            notification_type=Notification.NotificationType.INFO
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.recipient, self.user1)
        self.assertEqual(notification.message, "Test notification")
        self.assertEqual(notification.notification_type, Notification.NotificationType.INFO)
        self.assertFalse(notification.is_read)
        
    def test_notification_create_invalid_type(self):
        """Test notification creation with invalid type"""
        with self.assertRaises(InvalidNotificationTypeError):
            notification_create(
                recipient=self.user1,
                message="Test notification",
                notification_type="invalid_type"
            )

    def test_get_event_notification_recipients(self):
        """Test getting event notification recipients"""
        # to verify our test data is set up correctly
        pref = UserNotificationPreference.objects.get(user=self.user3)
        self.assertFalse(pref.event_updates, "User3's event_updates preference should be False")
        
        # This is to run the actual test
        recipients = get_event_notification_recipients(self.event)
        
        # Should include users with enabled preferences
        self.assertIn(self.user1, recipients)
        self.assertIn(self.user2, recipients)
        # Should not include user with disabled preferences
        self.assertNotIn(self.user3, recipients)

    def test_create_event_notification_new(self):
        """Test creating notification for new event"""
        notification = create_event_notification(
            event=self.event,
            recipient=self.user1,
            notification_type=Notification.NotificationType.INFO,
            is_update=False
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.recipient, self.user1)
        self.assertIn(self.event.title, notification.message)
        self.assertIn(self.event.community.name, notification.message)

    def test_create_event_notification_update(self):
        """Test creating notification for event update"""
        notification = create_event_notification(
            event=self.event,
            recipient=self.user1,
            notification_type=Notification.NotificationType.INFO,
            is_update=True
        )
        
        self.assertIsNotNone(notification)
        self.assertIn("has been updated", notification.message)

    def test_create_event_notification_with_additional_info(self):
        """Test creating event notification with additional info"""
        additional_info = {"custom_field": "custom_value"}
        notification = create_event_notification(
            event=self.event,
            recipient=self.user1,
            notification_type=Notification.NotificationType.INFO,
            additional_info=additional_info
        )
        
        self.assertIsNotNone(notification)
        self.assertIn("custom_value", notification.message)
    
    def test_notification_mark_as_read(self):
        """Test marking notification as read"""
        notification = notification_create(
            recipient=self.user1,
            message="Test notification",
            notification_type=Notification.NotificationType.INFO
        )
        
        updated_notification = notification_mark_as_read(notification)
        
        self.assertTrue(updated_notification.is_read)
        self.assertEqual(updated_notification.id, notification.id)

    def test_get_user_unread_notifications(self):
        """Test getting user's unread notifications"""
        # Create some notifications
        notification_create(
            recipient=self.user1,
            message="Test notification 1",
            notification_type=Notification.NotificationType.INFO
        )
        notification_create(
            recipient=self.user1,
            message="Test notification 2",
            notification_type=Notification.NotificationType.INFO
        )
        notification_create(
            recipient=self.user2,
            message="Test notification 3",
            notification_type=Notification.NotificationType.INFO
        )
        
        # Get unread notifications for user1
        unread_notifications = get_user_unread_notifications(self.user1)
        
        self.assertEqual(len(unread_notifications), 2)
        self.assertTrue(all(not n.is_read for n in unread_notifications))
        self.assertTrue(all(n.recipient == self.user1 for n in unread_notifications))
    
    def test_notification_ordering(self):
        """Test that notifications are ordered by creation date"""
        # Create notifications with different timestamps
        notification1 = notification_create(
            recipient=self.user1,
            message="First notification",
            notification_type=Notification.NotificationType.INFO
        )
        notification2 = notification_create(
            recipient=self.user1,
            message="Second notification",
            notification_type=Notification.NotificationType.INFO
        )
        
        unread_notifications = get_user_unread_notifications(self.user1)
        
        self.assertEqual(unread_notifications[0].id, notification2.id)
        self.assertEqual(unread_notifications[1].id, notification1.id)