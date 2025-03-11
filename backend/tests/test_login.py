from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from api.models import User


class LoginTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user", email="testuser@email.com", password="password123"
        )

        self.inactive_user = User.objects.create_user(
            username="inactive_user",
            email="inactiveuser@email.com",
            password="password123",
        )
        self.inactive_user.is_active = False
        self.inactive_user.save()

        self.client = APIClient()

        self.login_url = "/api/login/"

    def test_login_with_valid_credentials(self):
        payload = {
            "username": "test_user",
            "password": "password123",
        }

        response = self.client.post(self.login_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("token", response.json())
        self.assertIn("access", response.json()["token"])
        self.assertIn("refresh", response.json()["token"])

    def test_login_with_no_credentials(self):
        payload = {}

        response = self.client.post(self.login_url, payload)

        # Should be bad request because empty/invalid payload
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_invalid_credentials(self):
        payload = {"username": "test_user", "password": "password"}

        response = self.client.post(self.login_url, payload)

        # Should be forbidden due to invalid password
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_login_with_inactive_user(self):
        payload = {"username": "inactive_user", "password": "password123"}

        response = self.client.post(self.login_url, payload)

        # Should be forbidden due to the inactive account
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # TODO: Write tests to ensure protected routes are accessible with token (and not without)
