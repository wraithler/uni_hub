from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.users.models import BaseUser
from apps.profile_info.models import BaseUserProfile
from apps.profile_info.selectors import get_user_by_username

class ProfileInfoSelectorsTests(TestCase):

    def setUp(self):
        # Create users (BaseUser)
        self.user1 = BaseUser.objects.create_user(
            email="user1@example.com",
            username="unique_user1",
            first_name="John",
            last_name="Doe",
            password="password123"  # or omit for an unusable password
        )
        self.user2 = BaseUser.objects.create_user(
            email="user2@example.com",
            username="unique_user2",
            first_name="Jane",
            last_name="Smith",
            password="password123"
        )
    

    def test_get_user_by_username(self):
        # Test fetching an existing user
        user = get_user_by_username("unique_user1")  # Correct username usage
        self.assertEqual(user, self.user1)

        # Test non-existent user
        with self.assertRaises(ValidationError):
            get_user_by_username("nonexistentuser")