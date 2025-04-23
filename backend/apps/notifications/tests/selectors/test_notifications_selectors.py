from django.test import TestCase

from apps.notifications.models import Notification
from apps.notifications.selectors import (
    notification_list_by_user,
    notification_list_unread_by_user,
    notification_has_unread_by_user,
    notification_list_all,
    notification_get
)
from apps.users.services import user_create

class NotificationSelectorsTests(TestCase):
    """Tests for notification selector functions."""

    def setUp(self):
        """Set up test data."""
        # Create test users
        self.user = user_create(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            is_active=True,
            is_admin=False,
            password='testpassword'
        )
        self.other_user = user_create(
            email='other@example.com',
            first_name='Other',
            last_name='User',
            is_active=True,
            is_admin=False,
            password='otherpassword'
        )
        
        # Create test notifications
        self.notification1 = Notification.objects.create(
            recipient=self.user,
            message="Test notification 1",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
        self.notification2 = Notification.objects.create(
            recipient=self.user,
            message="Test notification 2",
            is_read=True,
            notification_type=Notification.NotificationType.ALERT
        )
        self.other_notification = Notification.objects.create(
            recipient=self.other_user,
            message="Other user's notification",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
    
    def test_notification_list_by_user(self):
        """Test retrieving all notifications for a user."""
        notifications = notification_list_by_user(user=self.user)
        
        self.assertEqual(notifications.count(), 2)
        self.assertIn(self.notification1, notifications)
        self.assertIn(self.notification2, notifications)
        self.assertNotIn(self.other_notification, notifications)
    
    def test_notification_list_unread_by_user(self):
        """Test retrieving unread notifications for a user."""
        notifications = notification_list_unread_by_user(user=self.user)
        
        self.assertEqual(notifications.count(), 1)
        self.assertIn(self.notification1, notifications)
        self.assertNotIn(self.notification2, notifications)
        self.assertNotIn(self.other_notification, notifications)
    
    def test_notification_has_unread_by_user(self):
        """Test checking if a user has unread notifications."""
        # User with unread notifications
        self.assertTrue(notification_has_unread_by_user(user=self.user))
        
        # User without unread notifications
        self.notification1.is_read = True
        self.notification1.save()
        self.assertFalse(notification_has_unread_by_user(user=self.user))
        
        # Reset for other tests
        self.notification1.is_read = False
        self.notification1.save()
    
    def test_notification_list_all(self):
        """Test retrieving all notifications in the system."""
        notifications = notification_list_all()
        
        self.assertEqual(notifications.count(), 3)
        self.assertIn(self.notification1, notifications)
        self.assertIn(self.notification2, notifications)
        self.assertIn(self.other_notification, notifications)
    
    def test_notification_get(self):
        """Test retrieving a specific notification for a user."""
        # Valid notification lookup
        notification = notification_get(user=self.user, notification_id=self.notification1.id)
        self.assertEqual(notification, self.notification1)
        
        # Invalid notification ID
        notification = notification_get(user=self.user, notification_id=99999)
        self.assertIsNone(notification)
        
        # Notification belongs to another user
        notification = notification_get(user=self.user, notification_id=self.other_notification.id)
        self.assertIsNone(notification)