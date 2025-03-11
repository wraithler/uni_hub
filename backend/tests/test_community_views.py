import logging

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User, Community, CommunityCategory

logger = logging.Logger(__name__)


class CommunityViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="test_user",
            email="test123@email.com",
            password="password123",
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.community = Community.objects.create(
            name="Test Community",
            description="This is a test community",
            category=CommunityCategory.objects.create(
                name="Test Category",
                description="This is a test category",
            ),
            created_by=self.user,
        )

    def test_community_list_endpoint_authenticated(self):
        response = self.client.get("/api/communities/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["results"]), 1)

    def test_community_detail_endpoint_authenticated(self):
        response = self.client.get("/api/communities/1/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.community.name)

    def test_community_list_endpoint_unauthenticated(self):
        self.client.credentials()

        response = self.client.get("/api/communities/")

        # Response should be 401 Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_community_detail_endpoint_unauthenticated(self):
        self.client.credentials()

        response = self.client.get("/api/communities/1/")

        # Response should be 401 Unauthorized
        self.assertEqual(response.status_code, 401)
