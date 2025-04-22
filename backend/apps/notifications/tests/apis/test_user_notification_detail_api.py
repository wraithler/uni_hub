from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from apps.notifications.models import Notification
from apps.users.services import user_create

class NotificationDetailAPITests(TestCase):
    """Tests for the NotificationDetailAPI view."""

    def setUp(self):
        """Set up test data."""
        # Use APIClient
        self.client = APIClient()
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
        # Login the user
        self.client.force_login(self.user)
        
        # Create test notifications
        self.notification = Notification.objects.create(
            recipient=self.user,
            message="Test notification detail",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
        
        # Create a notification for another user
        self.other_notification = Notification.objects.create(
            recipient=self.other_user,
            message="Other user's notification",
            is_read=False,
            notification_type=Notification.NotificationType.ALERT
        )
        
        # URLs for the notification endpoints
        self.url = f"/api/notifications/{self.notification.id}/"
        self.other_url = f"/api/notifications/{self.other_notification.id}/"
    
    def test_get_notification_detail_successful(self):
        """Test retrieving a specific notification successfully."""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Test notification detail")
        self.assertEqual(response.data['is_read'], False)
    
    def test_get_notification_not_found(self):
        """Test retrieving a non-existent notification."""
        non_existent_url = "/api/notifications/99999/"
        
        response = self.client.get(non_existent_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_get_notification_unauthorized_user(self):
        """Test user cannot access another user's notification."""
        response = self.client.get(self.other_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unauthenticated_request(self):
        """Test that unauthenticated requests are rejected."""
        # Log out the user
        self.client.logout()
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # Changed from 401 to 403

class MarkNotificationAsReadAPITests(TestCase):
    """Tests for the MarkNotificationAsReadAPI view."""

    def setUp(self):
        """Set up test data."""
        # Use APIClient
        self.client = APIClient()
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
        # Login the user
        self.client.force_login(self.user)
        
        # Create test notifications
        self.notification = Notification.objects.create(
            recipient=self.user,
            message="Test notification",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
        
        # Create a notification for another user
        self.other_notification = Notification.objects.create(
            recipient=self.other_user,
            message="Other user's notification",
            is_read=False,
            notification_type=Notification.NotificationType.ALERT
        )
        
        # URLs for the mark-as-read endpoints
        self.mark_read_url = f"/api/notifications/{self.notification.id}/mark-read/"
        self.other_mark_read_url = f"/api/notifications/{self.other_notification.id}/mark-read/"
    
    def test_mark_notification_as_read(self):
        """Test marking a notification as read."""
        response = self.client.put(self.mark_read_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Notification marked as read.")
        
        # Verify the notification is updated in the database
        updated_notification = Notification.objects.get(id=self.notification.id)
        self.assertTrue(updated_notification.is_read)
    
    def test_mark_notification_as_read_not_found(self):
        """Test marking a non-existent notification as read."""
        non_existent_url = "/api/notifications/99999/mark-read/"
        
        response = self.client.put(non_existent_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_mark_notification_as_read_unauthorized_user(self):
        """Test user cannot mark another user's notification as read."""
        response = self.client.put(self.other_mark_read_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Verify the other user's notification remains unread
        other_notification = Notification.objects.get(id=self.other_notification.id)
        self.assertFalse(other_notification.is_read)
    
    def test_unauthenticated_request(self):
        """Test that unauthenticated requests are rejected."""
        # Log out the user
        self.client.logout()
        
        response = self.client.put(self.mark_read_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # Changed from 401 to 403