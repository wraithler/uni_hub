from django.test import TestCase
from apps.profile.filters import ProfileFilter
from apps.profile.factories import ProfileFactory
from apps.profile.models import Profile

class ProfileBioFilterTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.profile1 = ProfileFactory.create()
        cls.profile2 = ProfileFactory.create()
        cls.profile3 = ProfileFactory(bio="")

    def test_filter_has_bio_true(self):
        filtered = ProfileFilter({'has_bio': True}, queryset=Profile.objects.all()).qs
        self.assertEqual(filtered.count(), 2)
        self.assertIn(self.profile1, filtered)
        self.assertIn(self.profile2, filtered)
        self.assertNotIn(self.profile3, filtered)

    def test_filter_has_bio_false(self):
        filtered = ProfileFilter({'has_bio': False}, queryset=Profile.objects.all()).qs
        self.assertEqual(filtered.count(), 1)
        self.assertEqual(filtered.first(), self.profile3)