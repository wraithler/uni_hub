from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.users.models import BaseUser
from apps.profile_info.models import BaseUserProfile
from apps.profile_info.selectors import get_user_profile

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

    def test_get_user_profile(self):

        profile = get_user_profile(self.user1.id)  
        self.assertEqual(profile.first_name, self.user1.first_name)
        self.assertEqual(profile.last_name, self.user1.last_name)

        with self.assertRaises(ValidationError):
            get_user_profile(999)  
    

