from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from apps.notifications.models import Notification
from apps.notifications.selectors import (
    get_user_notifications,
    get_unread_notifications,
    user_has_unread_notifications,
    list_all_notifications
)
from apps.users.factories import BaseUserFactory


class TestNotificationSelectors(TestCase):
    """Test suite for the Notification selector functions."""

    def setUp(self):
        """Setup data for each test method."""
        # Create users
        self.user1 = BaseUserFactory(email="user1@example.com", first_name="Test", last_name="User1")
        self.user2 = BaseUserFactory(email="user2@example.com", first_name="Test", last_name="User2")
        
        # Create notifications with various attributes
        # User 1 notifications
        self.notification1 = Notification.objects.create(
            recipient=self.user1,
            message="Test message 1",
            notification_type="info",
            is_read=False,
            created_at=timezone.now() - timedelta(days=5)
        )
        
        self.notification2 = Notification.objects.create(
            recipient=self.user1,
            message="Test message 2",
            notification_type="alert",
            is_read=True,
            created_at=timezone.now() - timedelta(days=3)
        )
        
        # User 2 notifications
        self.notification3 = Notification.objects.create(
            recipient=self.user2,
            message="Test message 3",
            notification_type="reminder",
            is_read=False,
            created_at=timezone.now() - timedelta(days=1)
        )
        
        self.notification4 = Notification.objects.create(
            recipient=self.user2,
            message="Test message 4",
            notification_type="promo",
            is_read=True,
            created_at=timezone.now()
        )

    def test_get_user_notifications(self):
        """Test retrieving all notifications for a specific user."""
        # Get notifications for user1
        user1_notifications = get_user_notifications(user=self.user1)
        
        # Check count
        self.assertEqual(user1_notifications.count(), 2)
        
        # Check specific notifications are included
        self.assertIn(self.notification1, user1_notifications)
        self.assertIn(self.notification2, user1_notifications)
        
        # Verify ordering (newest first)
        self.assertEqual(list(user1_notifications), [self.notification2, self.notification1])
        
        # Test for user2
        user2_notifications = get_user_notifications(user=self.user2)
        self.assertEqual(user2_notifications.count(), 2)
        self.assertIn(self.notification3, user2_notifications)
        self.assertIn(self.notification4, user2_notifications)
        
        # Test for user with no notifications
        user3 = BaseUserFactory(email="user3@example.com")
        user3_notifications = get_user_notifications(user=user3)
        self.assertEqual(user3_notifications.count(), 0)

    def test_get_unread_notifications(self):
        """Test retrieving unread notifications for a specific user."""
        # Get unread notifications for user1
        unread_notifications = get_unread_notifications(user=self.user1)
        
        # Should only return unread notifications
        self.assertEqual(unread_notifications.count(), 1)
        self.assertIn(self.notification1, unread_notifications)
        self.assertNotIn(self.notification2, unread_notifications)
        
        # Test for user2
        unread_notifications_user2 = get_unread_notifications(user=self.user2)
        self.assertEqual(unread_notifications_user2.count(), 1)
        self.assertIn(self.notification3, unread_notifications_user2)
        
        # Test for user with no unread notifications
        # First mark all user1's notifications as read
        self.notification1.is_read = True
        self.notification1.save()
        
        unread_after_update = get_unread_notifications(user=self.user1)
        self.assertEqual(unread_after_update.count(), 0)

    def test_user_has_unread_notifications(self):
        """Test checking if a user has any unread notifications."""
        # User1 should have unread notifications
        has_unread = user_has_unread_notifications(user=self.user1)
        self.assertTrue(has_unread)
        
        # After marking all as read, should return False
        self.notification1.is_read = True
        self.notification1.save()
        has_unread_after_update = user_has_unread_notifications(user=self.user1)
        self.assertFalse(has_unread_after_update)
        
        # Test for user with no notifications
        user3 = BaseUserFactory(email="user3@example.com")
        has_unread_user3 = user_has_unread_notifications(user=user3)
        self.assertFalse(has_unread_user3)

    def test_list_all_notifications(self):
        """Test retrieving all notifications in the system."""
        all_notifications = list_all_notifications()
        
        # Should return all 4 notifications
        self.assertEqual(all_notifications.count(), 4)
        
        # All notifications should be included
        self.assertIn(self.notification1, all_notifications)
        self.assertIn(self.notification2, all_notifications)
        self.assertIn(self.notification3, all_notifications)
        self.assertIn(self.notification4, all_notifications)
        
        # Test after adding another notification
        new_user = BaseUserFactory(email="newuser@example.com")
        new_notification = Notification.objects.create(
            recipient=new_user,
            message="New test message",
            notification_type="info",
            is_read=False
        )
        
        updated_all_notifications = list_all_notifications()
        self.assertEqual(updated_all_notifications.count(), 5)
        self.assertIn(new_notification, updated_all_notifications)