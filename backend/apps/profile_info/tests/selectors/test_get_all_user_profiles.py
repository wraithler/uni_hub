from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.users.models import BaseUser
from apps.profile_info.models import BaseUserProfile
from apps.profile_info.selectors import get_all_user_profiles

class ProfileInfoSelectorsTests(TestCase):

    def setUp(self):

        self.user1 = BaseUser.objects.create_user(
            email="user1@example.com",
            username="unique_user1",
            first_name="John",
            last_name="Doe",
            password="password123"  
        )
        self.user2 = BaseUser.objects.create_user(
            email="user2@example.com",
            username="unique_user2",
            first_name="Jane",
            last_name="Smith",
            password="password123"
        )

    def test_get_all_user_profiles(self):

        profiles = list(get_all_user_profiles())
        
        self.assertIn(self.user1, profiles)
        self.assertIn(self.user2, profiles)
        self.assertEqual(len(profiles), 2)