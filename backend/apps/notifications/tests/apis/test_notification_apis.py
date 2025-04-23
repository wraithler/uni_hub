from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from apps.notifications.models import Notification
from apps.users.services import user_create

class NotificationApisTests(TestCase):
    """Tests for the notification APIs."""

    def setUp(self):
        """Set up test data."""
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
        
        # Log in the test user
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
        self.other_notification = Notification.objects.create(
            recipient=self.other_user,
            message="Other user's notification",
            is_read=False,
            notification_type=Notification.NotificationType.INFO
        )
        
        # API endpoints
        self.list_url = "/api/notifications/"
        self.unread_url = "/api/notifications/unread/"
        self.detail_url = f"/api/notifications/{self.notification1.id}/"
        self.mark_read_url = f"/api/notifications/{self.notification1.id}/mark-read/"
        self.other_detail_url = f"/api/notifications/{self.other_notification.id}/"
        self.nonexistent_url = "/api/notifications/99999/"
        self.nonexistent_mark_read_url = "/api/notifications/99999/mark-read/"
    
    def test_notification_list_api(self):
        """Test listing all notifications for the current user."""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Check that the notifications belong to the current user
        for notification in response.data:
            self.assertEqual(notification['recipient'], self.user.id)
    
    def test_notification_list_api_empty(self):
        """Test listing notifications when there are none."""
        # Delete all notifications for the current user
        Notification.objects.filter(recipient=self.user).delete()
        
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], "No notifications found.")
    
    def test_unread_notification_list_api(self):
        """Test listing unread notifications for the current user."""
        response = self.client.get(self.unread_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['message'], "Test notification 1")
        self.assertEqual(response.data[0]['is_read'], False)
    
    def test_unread_notification_list_api_empty(self):
        """Test listing unread notifications when there are none."""
        # Mark all notifications as read
        Notification.objects.filter(recipient=self.user).update(is_read=True)
        
        response = self.client.get(self.unread_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], "No unread notifications found.")
    
    def test_notification_detail_api(self):
        """Test getting details of a specific notification."""
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.notification1.id)
        self.assertEqual(response.data['message'], "Test notification 1")
        self.assertEqual(response.data['is_read'], False)
    
    def test_notification_detail_api_not_found(self):
        """Test getting a non-existent notification."""
        response = self.client.get(self.nonexistent_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_notification_detail_api_unauthorized(self):
        """Test that users cannot access other users' notifications."""
        response = self.client.get(self.other_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_mark_notification_as_read_api(self):
        """Test marking a notification as read."""
        response = self.client.put(self.mark_read_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Notification marked as read.")
        
        # Verify the notification is marked as read in the database
        updated_notification = Notification.objects.get(id=self.notification1.id)
        self.assertTrue(updated_notification.is_read)
    
    def test_mark_notification_as_read_api_not_found(self):
        """Test marking a non-existent notification as read."""
        response = self.client.put(self.nonexistent_mark_read_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access the APIs."""
        # Log out the user
        self.client.logout()
        
        # Try to access the APIs
        list_response = self.client.get(self.list_url)
        unread_response = self.client.get(self.unread_url)
        detail_response = self.client.get(self.detail_url)
        mark_read_response = self.client.put(self.mark_read_url)
        
        # All requests should be rejected with 401 Unauthorized
        self.assertEqual(list_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(unread_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(detail_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(mark_read_response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('apps.notifications.apis.notification_list_by_user')
    def test_notification_list_api_uses_selector(self, mock_selector):
        """Test that NotificationListAPI uses the notification_list_by_user selector."""
        # Set up the mock to return an empty list
        mock_selector.return_value = []
        
        # Make the request
        self.client.get(self.list_url)
        
        # Verify the selector was called with the correct user
        mock_selector.assert_called_once_with(user=self.user)
    
    @patch('apps.notifications.apis.notification_list_unread_by_user')
    def test_unread_notification_list_api_uses_selector(self, mock_selector):
        """Test that UnreadNotificationListAPI uses the notification_list_unread_by_user selector."""
        # Set up the mock to return an empty list
        mock_selector.return_value = []
        
        # Make the request
        self.client.get(self.unread_url)
        
        # Verify the selector was called with the correct user
        mock_selector.assert_called_once_with(user=self.user)
    
    @patch('apps.notifications.apis.notification_get')
    def test_notification_detail_api_uses_selector(self, mock_selector):
        """Test that NotificationDetailAPI uses the notification_get selector."""
        # Set up the mock to return None (not found)
        mock_selector.return_value = None
        
        # Make the request
        self.client.get(self.detail_url)
        
        # Verify the selector was called with the correct user and notification ID
        mock_selector.assert_called_once_with(user=self.user, notification_id=self.notification1.id)
    
    @patch('apps.notifications.apis.notification_mark_as_read')
    @patch('apps.notifications.apis.notification_get')
    def test_mark_notification_as_read_api_uses_selector_and_service(self, mock_selector, mock_service):
        """Test that MarkNotificationAsReadAPI uses the notification_get selector and notification_mark_as_read service."""
        # Set up the mocks
        mock_selector.return_value = self.notification1
        mock_service.return_value = self.notification1
        
        # Make the request
        self.client.put(self.mark_read_url)
        
        # Verify the selector was called with the correct user and notification ID
        mock_selector.assert_called_once_with(user=self.user, notification_id=self.notification1.id)
        
        # Verify the service was called with the correct notification
        mock_service.assert_called_once_with(notification=self.notification1)