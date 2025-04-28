from django.test import TestCase
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.notifications.models import Notification
from apps.notifications.services import (
    notification_create,
    notification_update,
    notification_mark_as_read,
    notification_get_event_recipients,
    notification_create_for_event,
    notification_get_user_unread,
    notification_create_for_post,
    notification_create_for_announcement,
    notification_create_for_community_update,
    notification_get_recipients_by_preference,
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

class MockPost:
    def __init__(self, title, content, author, community):
        self.id = 1
        self.title = title
        self.content = content
        self.author = author
        self.community = community

    def get_full_name(self):
        return f"{self.author.first_name} {self.author.last_name}"

class MockAnnouncement:
    def __init__(self, title, content, community, priority):
        self.id = 1
        self.title = title
        self.content = content
        self.community = community
        self.priority = priority

class NotificationServicesTests(TestCase):
    def setUp(self):
        # Create test users
        self.user1 = BaseUserFactory.create(first_name="John", last_name="Doe")
        self.user2 = BaseUserFactory.create(first_name="Jane", last_name="Smith")
        self.user3 = BaseUserFactory.create(first_name="Bob", last_name="Johnson")
        
        # Create a community
        self.community = CommunityFactory.create()
        
        # Add members to the community
        CommunityMembership.objects.create(user=self.user1, community=self.community)
        CommunityMembership.objects.create(user=self.user2, community=self.community)
        CommunityMembership.objects.create(user=self.user3, community=self.community)
        
        # Create notification preferences
        UserNotificationPreference.objects.filter(user__in=[self.user1, self.user2, self.user3]).delete()
        
        self.pref1 = UserNotificationPreference.objects.create(
            user=self.user1,
            event_updates=True,
            post_notifications=True,
            announcements=True,
            in_app_notifications=True
        )
        
        self.pref2 = UserNotificationPreference.objects.create(
            user=self.user2,
            event_updates=True,
            post_notifications=True,
            announcements=True,
            in_app_notifications=True
        )
        
        self.pref3 = UserNotificationPreference.objects.create(
            user=self.user3,
            event_updates=False,
            post_notifications=False,
            announcements=False,
            in_app_notifications=True
        )
        
        # Create test data
        self.event = EventFactory.create(
            created_by=self.user1,
            community=self.community
        )
        
        # Create mock post
        self.post = MockPost(
            title="Test Post",
            content="Test Content",
            author=self.user1,
            community=self.community
        )
        
        # Create mock announcement
        self.announcement = MockAnnouncement(
            title="Test Announcement",
            content="Test Content",
            community=self.community,
            priority="High"
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

    def test_notification_update(self):
        """Test notification update"""
        notification = notification_create(
            recipient=self.user1,
            message="Test notification",
            notification_type=Notification.NotificationType.INFO
        )
        
        updated_notification = notification_update(
            notification=notification,
            message="Updated message",
            notification_type=Notification.NotificationType.ALERT
        )
        
        self.assertEqual(updated_notification.message, "Updated message")
        self.assertEqual(updated_notification.notification_type, Notification.NotificationType.ALERT)

    def test_notification_mark_as_read(self):
        """Test marking notification as read"""
        notification = notification_create(
            recipient=self.user1,
            message="Test notification",
            notification_type=Notification.NotificationType.INFO
        )
        
        updated_notification = notification_mark_as_read(notification)
        
        self.assertTrue(updated_notification.is_read)

    def test_get_event_notification_recipients(self):
        """Test getting event notification recipients"""
        recipients = notification_get_event_recipients(self.event)
        
        self.assertIn(self.user1, recipients)
        self.assertIn(self.user2, recipients)
        self.assertNotIn(self.user3, recipients)

    def test_create_event_notification(self):
        """Test creating event notification"""
        notification = notification_create_for_event(
            event=self.event,
            recipient=self.user1,
            notification_type=Notification.NotificationType.ALERT
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.recipient, self.user1)
        self.assertEqual(notification.notification_type, Notification.NotificationType.ALERT)
        self.assertIn(self.event.title, notification.message)

    def test_get_user_unread_notifications(self):
        """Test getting user unread notifications"""
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
        
        unread_notifications = notification_get_user_unread(self.user1)
        
        self.assertEqual(len(unread_notifications), 2)

    def test_create_post_notification(self):
        """Test creating post notification"""
        notification = notification_create_for_post(
            post=self.post,
            recipient=self.user1,
            notification_type=Notification.NotificationType.ALERT
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.recipient, self.user1)
        self.assertEqual(notification.notification_type, Notification.NotificationType.ALERT)
        self.assertIn(self.post.title, notification.message)
        self.assertIn(self.post.content[:100], notification.message)

    def test_create_announcement_notification(self):
        """Test creating announcement notification"""
        notification = notification_create_for_announcement(
            announcement=self.announcement,
            recipient=self.user1,
            notification_type=Notification.NotificationType.ALERT
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.recipient, self.user1)
        self.assertEqual(notification.notification_type, Notification.NotificationType.ALERT)
        self.assertIn(self.announcement.title, notification.message)
        self.assertIn(self.announcement.content[:100], notification.message)

    def test_create_community_update_notification(self):
        """Test creating community update notification"""
        notification = notification_create_for_community_update(
            community=self.community,
            recipient=self.user1,
            update_type="Test Update",
            notification_type=Notification.NotificationType.ALERT
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.recipient, self.user1)
        self.assertEqual(notification.notification_type, Notification.NotificationType.ALERT)
        self.assertIn(self.community.name, notification.message)
        self.assertIn("Test Update", notification.message)

    def test_get_recipients_by_preference(self):
        """Test getting recipients by preference"""
        # Test post notifications
        post_recipients = notification_get_recipients_by_preference(
            notification_type=Notification.NotificationType.POST,  
            community=self.community
        )
        self.assertIn(self.user1, post_recipients)
        self.assertIn(self.user2, post_recipients)
        self.assertNotIn(self.user3, post_recipients)
    
    # Test announcement notifications
        announcement_recipients = notification_get_recipients_by_preference(
            notification_type=Notification.NotificationType.ANNOUNCEMENT,  
            community=self.community
    )
        self.assertIn(self.user1, announcement_recipients)
        self.assertIn(self.user2, announcement_recipients)
        self.assertNotIn(self.user3, announcement_recipients)
    
    # Test alert notifications (which should include all users with in_app_notifications=True)
        alert_recipients = notification_get_recipients_by_preference(
            notification_type=Notification.NotificationType.ALERT,
            community=self.community
    )
        self.assertIn(self.user1, alert_recipients)
        self.assertIn(self.user2, alert_recipients)
        self.assertIn(self.user3, alert_recipients)  # Should be included as in_app_notifications is True

    def test_notification_with_additional_info(self):
        """Test notification creation with additional info"""
        additional_info = {
            "key1": "value1",
            "key2": "value2"
        }
        
        notification = notification_create_for_post(
            post=self.post,
            recipient=self.user1,
            notification_type=Notification.NotificationType.ALERT,
            additional_info=additional_info
        )
        
        self.assertIsNotNone(notification)
        self.assertIn("key1: value1", notification.message)
        self.assertIn("key2: value2", notification.message)

    def test_notification_error_handling(self):
        """Test error handling in notification creation"""
        # Test with invalid post data
        invalid_post = MockPost(
            title=None,  
            content="Test Content",
            author=self.user1,
            community=self.community
        )
        
        notification = notification_create_for_post(
            post=invalid_post,
            recipient=self.user1,
            notification_type=Notification.NotificationType.ALERT
        )
        
        self.assertIsNone(notification)  # Should return None on error
