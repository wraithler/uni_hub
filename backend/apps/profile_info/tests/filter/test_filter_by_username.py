from django.test import TestCase
from apps.users.models import BaseUser
from apps.profile_info.filters import ProfileInfoFilter

class ProfileInfoFilterTestCase(TestCase):

    def setUp(self):
        self.user1 = BaseUser.objects.create(username="unique_user1", email="user1@example.com", first_name="John", last_name="Doe")
        self.user2 = BaseUser.objects.create(username="unique_user2", email="user2@example.com", first_name="Jane", last_name="Smith")

    def test_filter_by_username(self):

        filter_set = ProfileInfoFilter({"username": "user1"})
        filtered_users = filter_set.qs
        self.assertEqual(filtered_users.count(), 1)
        self.assertEqual(filtered_users.first().username, "unique_user1")
