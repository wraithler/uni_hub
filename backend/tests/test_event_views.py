import logging

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import User, Event, Community, CommunityCategory

logger = logging.Logger(__name__)


class EventViewsTestCase(TestCase):
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
            name="AI Community",
            description="ajdiwadwadwa",
            category=CommunityCategory.objects.create(
                name="AI",
                description="hwadhwad"
            ),
            emoji="",
            created_by=self.user
        )

        self.event = Event.objects.create(
            title="Tech Talk",
            description="Discussion on AI and ML",
            event_date="2025-05-20T14:00:00Z",
            location="London Tech Hub",
            created_by=self.user,
            virtual_event=False,
            community=self.community
        )

    def test_event_list_endpoint_authenticated(self):
        response = self.client.get("/api/events/")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["results"]), 1)

    def test_event_detail_endpoint_authenticated(self):
        response = self.client.get(f"/api/events/{self.event.id}/")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], self.event.title)

    def test_event_list_endpoint_unauthenticated(self):
        self.client.credentials()
        response = self.client.get("/api/events/")
        
        self.assertEqual(response.status_code, 401)

    def test_event_creation(self):
        data = {
            "title": "Cybersecurity Panel",
            "description": "A talk on the latest trends in cybersecurity",
            "event_date": "2025-06-10 00:22:01.247060 +00:00",
            "location": "Online",
            "created_by": self.user.id,
            "virtual_event": True,
            "virtual_link": "https://zoom.us/example",
            "community": self.community.id
        }
        response = self.client.post("/api/events/create/", data, format="json")
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["title"], "Cybersecurity Panel")

    def test_event_attendance(self):
        data = {"user": self.user.id, "event": self.event.id}
        response = self.client.post(f"/api/events/{self.event.id}/attend/", data, format="json")
        
        self.assertEqual(response.status_code, 201)
