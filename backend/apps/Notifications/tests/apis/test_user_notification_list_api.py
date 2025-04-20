from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.notifications.models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class UserNotificationListAPITests(TestCase):
    """Tests for the UserNotificationListAPI view."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test notifications
        self.notification1 = Notification.objects.create(
            user=self.user,
            content="Test notification 1",
            is_read=False
        )
        self.notification2 = Notification.objects.create(
            user=self.user,
            content="Test notification 2",
            is_read=True
        )
        
        # URL for the notification list endpoint
        self.url = reverse('user-notifications-list')  # Update with your actual URL name
    
    def test_get_notifications_successful(self):
        """Test retrieving notifications when user has notifications."""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['content'], "Test notification 1")
        self.assertEqual(response.data[1]['content'], "Test notification 2")
    
    def test_get_notifications_empty(self):
        """Test retrieving notifications when user has no notifications."""
        # Delete existing notifications
        Notification.objects.filter(user=self.user).delete()
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], "No notifications found.")
    
    def test_unauthenticated_request(self):
        """Test that unauthenticated requests are rejected."""
        # Log out the user
        self.client.force_authenticate(user=None)
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)