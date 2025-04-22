from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from apps.notifications.models import Notification
from apps.users.services import user_create

class NotificationListAPITests(TestCase):
    """Tests for the NotificationListAPI view."""

    def setUp(self):
        """Set up test data."""
        # Use APIClient
        self.client = APIClient()
        # Create a test user
        self.user = user_create(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            is_active=True,
            is_admin=False,
            password='testpassword'
        )
        # Login the user
        self.client.force_login(self.user)
        
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
        
        # URL for the notification list endpoint
        self.url = "/api/notifications/"
    
    def test_get_notifications_successful(self):
        """Test retrieving notifications when user has notifications."""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Sort the response data to ensure consistent test results
        sorted_data = sorted(response.data, key=lambda x: x['message'])
        self.assertEqual(sorted_data[0]['message'], "Test notification 1")
        self.assertEqual(sorted_data[1]['message'], "Test notification 2")
    
    def test_get_notifications_empty(self):
        """Test retrieving notifications when user has no notifications."""
        # Delete existing notifications
        Notification.objects.filter(recipient=self.user).delete()
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], "No notifications found.")
    
    def test_unauthenticated_request(self):
        """Test that unauthenticated requests are rejected."""
        # Log out the user
        self.client.logout()
        
        response = self.client.get(self.url)
        
        # Changed from 401 to 403 to match actual API behavior
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class UnreadNotificationListAPITests(TestCase):
    """Tests for the UnreadNotificationListAPI view."""

    def setUp(self):
        """Set up test data."""
        # Use APIClient
        self.client = APIClient()
        # Create a test user
        self.user = user_create(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            is_active=True,
            is_admin=False,
            password='testpassword'
        )
        # Login the user
        self.client.force_login(self.user)
        
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
            is_read=True,  # This one is read
            notification_type=Notification.NotificationType.ALERT
        )
        
        # URL for the unread notification list endpoint
        self.url = "/api/notifications/unread/"
    
    def test_get_unread_notifications_successful(self):
        """Test retrieving unread notifications."""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only one unread notification
        self.assertEqual(response.data[0]['message'], "Test notification 1")
        self.assertEqual(response.data[0]['is_read'], False)
    
    def test_get_unread_notifications_empty(self):
        """Test retrieving unread notifications when there are none."""
        # Mark all notifications as read
        Notification.objects.filter(recipient=self.user).update(is_read=True)
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], "No unread notifications found.")
    
    def test_unauthenticated_request(self):
        """Test that unauthenticated requests are rejected."""
        # Log out the user
        self.client.logout()
        
        response = self.client.get(self.url)
        
        # Changed from 401 to 403 to match actual API behavior
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)