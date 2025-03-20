import time
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, UserNotificationPreference, Community, CommunityCategory

class NotificationPreferenceTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user",
            email="test@example.com",
            password="password123"
        )

        self.other_user = User.objects.create_user(
            username="other_user",
            email="other@example.com",
            password="password123"
        )

        self.category = CommunityCategory.objects.create(
            name="Sports",
            description="All things sports."
        )

        self.community = Community.objects.create(
            name="Football Fans",
            description="A place for football lovers.",
            created_by=self.user,
            category=self.category
        )

        
        self.preferences, created = UserNotificationPreference.objects.get_or_create(user=self.user)
        self.preferences.subscribed_communities.add(self.community)

       
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_get_notification_preferences(self):
        url = f"/api/notification-preferences/{self.user.id}/"  
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("event_updates", response.data)
        self.assertIn("post_notifications", response.data)
        self.assertIn("announcements", response.data)

    def test_update_notification_preferences(self):
        url = f"/api/notification-preferences/{self.user.id}/"  
        data = {
            "event_updates": False,
            "post_notifications": True,
            "announcements": False,
            "email_notifications": False,
            "in_app_notifications": True,
            "subscribed_communities": [self.community.id]
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["event_updates"])

    def test_preferences_response_time(self):
        url = f"/api/notification-preferences/{self.user.id}/"  
        start_time = time.time()
        response = self.client.get(url)
        end_time = time.time()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(end_time - start_time < 1)

    def test_unauthenticated_access(self):
        self.client.credentials()  
        url = f"/api/notification-preferences/{self.user.id}/"  
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_forbidden_access(self):
        refresh = RefreshToken.for_user(self.other_user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = f"/api/notification-preferences/{self.user.id}/"  
        data = {
            "event_updates": False,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 403)
    
    def test_default_notification_preferences(self):
        new_user = User.objects.create_user(
            username="new_user",
            email="newuser@example.com",
            password="password123"
        )
        refresh = RefreshToken.for_user(new_user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = f"/api/notification-preferences/{new_user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["event_updates"], True)
        self.assertEqual(response.data["post_notifications"], True)
        self.assertEqual(response.data["announcements"], True)
        self.assertEqual(response.data["email_notifications"], True)
        self.assertEqual(response.data["in_app_notifications"], True)

    
    def test_invalid_update_notification_preferences(self):
        url = f"/api/notification-preferences/{self.user.id}/"
        data = {
            "event_updates": "invalid_boolean", 
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 400)  
    
    def test_subscribed_to_no_communities(self):
        url = f"/api/notification-preferences/{self.user.id}/"
        data = {
            "subscribed_communities": []  
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["subscribed_communities"], [])

    
    def test_user_with_no_preferences(self):
        new_user = User.objects.create_user(
            username="new_user",
            email="newuser@example.com",
            password="password123"
        )
        refresh = RefreshToken.for_user(new_user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = f"/api/notification-preferences/{new_user.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("event_updates", response.data)
        self.assertIn("post_notifications", response.data)