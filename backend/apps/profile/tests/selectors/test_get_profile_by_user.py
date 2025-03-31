from django.test import TestCase
from apps.profile.selectors import profile_get
from apps.users.factories import BaseUserFactory
from apps.profile.models import Profile
from rest_framework.exceptions import NotFound


class GetProfileByUserTestCase(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory.create()
        self.user2 = BaseUserFactory.create()
        self.user3 = BaseUserFactory.create()

        self.profile1 = Profile.objects.create(user=self.user1, bio="User 1 Bio")
        self.profile2 = Profile.objects.create(user=self.user2, bio="User 2 Bio")

    def test_get_profile_by_user_exists(self):
        profile = profile_get(self.user1)
        self.assertIsNotNone(profile)
        self.assertEqual(profile.user, self.user1)

    def test_get_profile_by_user_not_exists(self):
        with self.assertRaises(NotFound) as context:
            profile_get(self.user3)

        self.assertEqual(
            str(context.exception), "Profile not found for the given user."
        )
