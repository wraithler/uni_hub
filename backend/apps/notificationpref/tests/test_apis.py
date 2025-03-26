from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import BaseUser
from apps.notificationpref.models import UserNotificationPreference
from django.urls import reverse
from django.contrib.auth import get_user_model

class UserNotificationPreferenceAPITestCase(APITestCase):

    def setUp(self):
        User = get_user_model()
        self.url = reverse('notificationpref:notification-preferences')

        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            first_name="Test",
            last_name="User"
        )

        self.pref, created = UserNotificationPreference.objects.get_or_create(
            user=self.user
        )
        
        self.token = RefreshToken.for_user(self.user)
        self.headers = {
            'Authorization': f'Bearer {self.token.access_token}'
        }

    def test_get_notification_preferences(self):
        response = self.client.get(self.url, headers=self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.id)
        self.assertTrue('email_notifications' in response.data)
        self.assertTrue('in_app_notifications' in response.data)

    def test_patch_notification_preferences(self):
        data = {
            'email_notifications': False,
            'push_notifications': True,
        }
        response = self.client.patch(self.url, data, headers=self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.pref.refresh_from_db()
        self.assertFalse(self.pref.email_notifications)
        self.assertTrue(self.pref.post_notifications)

    def test_patch_invalid_notification_preferences(self):
        data = {
            'email_notifications': 'not_a_boolean' 
        }
        response = self.client.patch(self.url, data, headers=self.headers)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email_notifications', response.data)

    def test_unauthenticated_access(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions(self):
        user2 = BaseUser.objects.create_user(
            username='testuser2',
            email='testuser2@example.com',
            password='password123',
            first_name='Test',
            last_name='User2' 
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(user2).access_token}')
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data['user'], self.user.id)  