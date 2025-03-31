from django.test import TestCase
from apps.profile.filters import ProfileFilter
from apps.profile.models import Profile
from apps.users.factories import BaseUserFactory
from apps.profile.factories import ProfileFactory


class ProfileFilterTests(TestCase):
    def setUp(self):
        self.profile1 = ProfileFactory.create(gender="M", hobbies="SPORTS", bio="Bio 1")
        self.profile2 = ProfileFactory.create(gender="F", hobbies="MUSIC", bio="Bio 2")
        self.profile3 = ProfileFactory.create(gender="M", hobbies="READING", bio="")

    def test_filter_by_gender(self):
        filtered = ProfileFilter({"gender": "M"}, queryset=Profile.objects.all()).qs
        self.assertEqual(filtered.count(), 2)
        self.assertIn(self.profile1, filtered)
        self.assertIn(self.profile3, filtered)

    def test_filter_by_hobbies(self):
        filtered = ProfileFilter({"hobbies": "SPORTS"}, queryset=Profile.objects.all()).qs
        self.assertEqual(filtered.count(), 1)
        self.assertEqual(filtered.first(), self.profile1)