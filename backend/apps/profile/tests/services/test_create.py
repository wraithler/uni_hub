from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.profile.services import profile_create
from apps.profile.factories import ProfileFactory
from apps.users.factories import BaseUserFactory

class ProfileCreateTests(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory.create()
        self.user2 = BaseUserFactory.create()
        self.profile1 = ProfileFactory.create(user=self.user1)

    def test_profile_create_success(self):
        profile = profile_create(user=self.user2, bio="New bio", hobbies="MUSIC")
        self.assertEqual(profile.user, self.user2)
        self.assertEqual(profile.hobbies, "MUSIC")
        self.assertEqual(profile.bio, "New bio")

    def test_profile_create_already_exists(self):
        with self.assertRaises(ValidationError):
            profile_create(user=self.user1, bio="Duplicate")