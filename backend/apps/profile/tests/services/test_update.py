from django.test import TestCase
from apps.profile.services import profile_update
from apps.profile.factories import ProfileFactory
from apps.users.factories import BaseUserFactory


class ProfileUpdateTests(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory.create()
        self.user2 = BaseUserFactory.create()
        self.profile1 = ProfileFactory.create(
            user=self.user1, gender="M", hobbies="READING", bio="Initial bio"
        )

    def test_profile_update_success(self):
        updated_data = {"bio": "Updated bio", "hobbies": "MUSIC"}
        updated_profile = profile_update(profile=self.profile1, data=updated_data)
        self.assertEqual(updated_profile.bio, "Updated bio")
        self.assertEqual(updated_profile.hobbies, "MUSIC")

    def test_profile_update_ignores_unlisted_fields(self):
        original_user = self.profile1.user
        updated_data = {"user": self.user2}
        updated_profile = profile_update(profile=self.profile1, data=updated_data)
        self.assertEqual(updated_profile.user, original_user)

    def test_profile_partial_update(self):
        updated_profile = profile_update(
            profile=self.profile1, data={"bio": "Partial update"}
        )
        self.assertEqual(updated_profile.bio, "Partial update")
        self.assertEqual(updated_profile.hobbies, "READING")
        self.assertEqual(updated_profile.gender, "M")
