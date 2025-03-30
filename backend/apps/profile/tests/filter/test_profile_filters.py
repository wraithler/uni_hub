from django.test import TestCase
from apps.profile.filters import ProfileFilter
from apps.profile.models import Profile
from apps.users.factories import BaseUserFactory
from apps.profile.factories import ProfileFactory


class ProfileFilterTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user1 = BaseUserFactory.create()
        cls.user2 = BaseUserFactory.create()
        cls.user3 = BaseUserFactory.create()
        cls.profile1 = Profile.objects.create(user=cls.user1, gender="M", hobbies="SPORTS", bio="Bio 1")
        cls.profile2 = Profile.objects.create(user=cls.user2, gender="F", hobbies="MUSIC", bio="Bio 2")
        cls.profile3 = Profile.objects.create(user=cls.user3, gender="M", hobbies="READING", bio="")

    def test_filter_by_gender(self):
        filtered = ProfileFilter({"gender": "M"}, queryset=Profile.objects.all()).qs
        self.assertEqual(filtered.count(), 2)
        self.assertIn(self.profile1, filtered)
        self.assertIn(self.profile3, filtered)

    def test_filter_by_hobbies(self):
        filtered = ProfileFilter({"hobbies": "SPORTS"}, queryset=Profile.objects.all()).qs
        self.assertEqual(filtered.count(), 1)
        self.assertEqual(filtered.first(), self.profile1)