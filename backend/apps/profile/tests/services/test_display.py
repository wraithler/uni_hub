from django.test import TestCase
from apps.profile.services import get_profile_display_data
from apps.profile.factories import ProfileFactory
from apps.users.factories import BaseUserFactory


class ProfileDisplayTests(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory.create()
        self.profile1 = ProfileFactory.create(
            user=self.user1,
            gender="M",
            hobbies="READING",
            bio="Initial bio",
            website_url="https://example.com",
            github_url="https://github.com/user1",
            linkedin_url="https://linkedin.com/in/user1",
        )

    def test_get_profile_display_data(self):
        """Test display data formatting"""
        expected_data = {
            "gender": {"value": "M", "display": "Male"},
            "hobbies": {"value": "READING", "display": "Reading"},
            "bio": "Initial bio",
            "website_url": "https://example.com",
            "github_url": "https://github.com/user1",
            "linkedin_url": "https://linkedin.com/in/user1",
        }
        display_data = get_profile_display_data(self.profile1)
        self.assertEqual(display_data, expected_data)
