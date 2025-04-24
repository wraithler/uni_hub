from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.notifications.models import Notification
from apps.notifications.services import notification_create, notification_mark_as_read, notification_update
from apps.users.services import user_create

class NotificationServicesTests(TestCase):
    """Tests for notification service functions."""
    
    def setUp(self):
        """Set up test data."""
        self.user = user_create(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            is_active=True,
            is_admin=False,
            password='testpassword'
        )
    
    def test_notification_create(self):
        """Test creating a notification."""
        notification = notification_create(
            recipient=self.user,
            message="Test notification",
            notification_type=Notification.NotificationType.INFO,
            is_read=False
        )
        
        # Verify the notification was created correctly
        self.assertEqual(notification.recipient, self.user)
        self.assertEqual(notification.message, "Test notification")
        self.assertEqual(notification.notification_type, Notification.NotificationType.INFO)
        self.assertFalse(notification.is_read)
        
        # Verify it's in the database
        db_notification = Notification.objects.get(id=notification.id)
        self.assertEqual(db_notification, notification)
    
    def test_notification_mark_as_read(self):
        """Test marking a notification as read."""
        # Create a notification
        notification = Notification.objects.create(
            recipient=self.user,
            message="Test notification",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
        
        # Verify it's not read initially
        self.assertFalse(notification.is_read)
        
        # Mark it as read
        updated_notification = notification_mark_as_read(notification=notification)
        
        # Verify it's marked as read
        self.assertTrue(updated_notification.is_read)
        
        # Verify the database was updated
        db_notification = Notification.objects.get(id=notification.id)
        self.assertTrue(db_notification.is_read)
    
    def test_notification_mark_as_read_already_read(self):
        """Test marking an already read notification."""
        # Create an already read notification
        notification = Notification.objects.create(
            recipient=self.user,
            message="Test notification",
            is_read=True,
            notification_type=Notification.NotificationType.INFO
        )
        
        # Mark it as read again
        updated_notification = notification_mark_as_read(notification=notification)
        
        # Verify it's still marked as read
        self.assertTrue(updated_notification.is_read)
    
    def test_notification_update(self):
        """Test updating a notification."""
        # Create a notification
        notification = Notification.objects.create(
            recipient=self.user,
            message="Original message",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
        
        # Update multiple fields
        updated_notification = notification_update(
            notification,
            message="Updated message",
            notification_type=Notification.NotificationType.WARNING
        )
        
        # Verify fields were updated
        self.assertEqual(updated_notification.message, "Updated message")
        self.assertEqual(updated_notification.notification_type, Notification.NotificationType.WARNING)
        self.assertFalse(updated_notification.is_read)  # Should remain unchanged
        
        # Verify the database was updated
        db_notification = Notification.objects.get(id=notification.id)
        self.assertEqual(db_notification.message, "Updated message")
        self.assertEqual(db_notification.notification_type, Notification.NotificationType.WARNING)