from django.test import TestCase
from apps.profile.selectors import get_profiles
from apps.users.factories import BaseUserFactory
from apps.profile.models import Profile

class GetProfilesTestCase(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory.create()
        self.user2 = BaseUserFactory.create()

        self.profile1 = Profile.objects.create(user=self.user1, bio="User 1 Bio")
        self.profile2 = Profile.objects.create(user=self.user2, bio="User 2 Bio")

    def test_get_profiles_no_filter(self):
        profiles = list(get_profiles())  
        self.assertEqual(len(profiles), 2)  

    def test_get_profiles_with_filter(self):
        filtered_profiles = list(get_profiles(filters={"bio": "User 1 Bio"}))
        self.assertEqual(len(filtered_profiles), 1)
        self.assertEqual(filtered_profiles[0].bio, "User 1 Bio")

    def test_get_profiles_empty_result(self):
        profiles = list(get_profiles(filters={"bio": "Nonexistent"}))
        self.assertEqual(len(profiles), 0)