import logging

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User, Post, Community, CommunityCategory

logger = logging.Logger(__name__)

class PostViewTests(TestCase):
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

        self.post = Post.objects.create(
            title="Test Post",
            content="Test post content",
            community=self.community,
            created_by=self.user,
        )

    def test_post_list_authenticated(self):
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, 200)

    def test_post_detail_authenticated(self):
        response = self.client.get(f"/api/posts/{self.post.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["content"], self.post.content)

    def test_post_list_unauthenticated(self):
        self.client.credentials()
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, 401)

    def test_post_creation(self):
        data = {
            "title": "New Post",
            "content": "New Post Content",
            "community": self.community.id,
            "created_by": self.user.id
        }
        response = self.client.post("/api/posts/create/", data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["title"], "New Post")