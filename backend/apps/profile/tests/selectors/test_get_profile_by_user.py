from django.test import TestCase
from apps.profile.selectors import get_profile_by_user
from apps.users.factories import BaseUserFactory
from apps.profile.models import Profile


class GetProfileByUserTestCase(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory.create()
        self.user2 = BaseUserFactory.create()
        self.user3 = BaseUserFactory.create()

        self.profile1 = Profile.objects.create(user=self.user1, bio="User 1 Bio")
        self.profile2 = Profile.objects.create(user=self.user2, bio="User 2 Bio")

    def test_get_profile_by_user_exists(self):
        profile = get_profile_by_user(self.user1)
        self.assertIsNotNone(profile)
        self.assertEqual(profile.user, self.user1)

    def test_get_profile_by_user_not_exists(self):
        profile = get_profile_by_user(self.user3)
        self.assertIsNone(profile)