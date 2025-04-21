from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.notifications.models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class UserNotificationDetailAPITests(TestCase):
    """Tests for the UserNotificationDetailAPI view."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test notification
        self.notification = Notification.objects.create(
            user=self.user,
            content="Test notification detail",
            is_read=False
        )
        
        # Create a notification for another user
        self.other_notification = Notification.objects.create(
            user=self.other_user,
            content="Other user's notification",
            is_read=False
        )
        
        # URL for the notification detail endpoint
        self.url = reverse('user-notification-detail', args=[self.notification.id])  # Update with your actual URL name
        self.other_url = reverse('user-notification-detail', args=[self.other_notification.id])  # Update with your actual URL name
    
    def test_get_notification_detail_successful(self):
        """Test retrieving a specific notification successfully."""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], "Test notification detail")
        self.assertEqual(response.data['is_read'], False)
    
    def test_get_notification_not_found(self):
        """Test retrieving a non-existent notification."""
        non_existent_url = reverse('user-notification-detail', args=[99999])  # Update with your actual URL name
        
        response = self.client.get(non_existent_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_get_notification_unauthorized_user(self):
        """Test user cannot access another user's notification."""
        response = self.client.get(self.other_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_mark_notification_as_read(self):
        """Test marking a notification as read."""
        response = self.client.put(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Notification marked as read.")
        
        # Verify the notification is updated in the database
        updated_notification = Notification.objects.get(id=self.notification.id)
        self.assertTrue(updated_notification.is_read)
    
    def test_mark_notification_as_read_not_found(self):
        """Test marking a non-existent notification as read."""
        non_existent_url = reverse('user-notification-detail', args=[99999])  # Update with your actual URL name
        
        response = self.client.put(non_existent_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unauthenticated_request(self):
        """Test that unauthenticated requests are rejected."""
        # Log out the user
        self.client.force_authenticate(user=None)
        
        get_response = self.client.get(self.url)
        put_response = self.client.put(self.url)
        
        self.assertEqual(get_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(put_response.status_code, status.HTTP_401_UNAUTHORIZED)