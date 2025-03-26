from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.users.models import BaseUser
from apps.profile_info.services import update_user_profile, get_user_profile

class ServicesTestCase(TestCase):

    def setUp(self):
        
        self.user = BaseUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            first_name='Test',
            last_name='User'
        )

    
    def test_get_user_profile_invalid_user(self):
     
        with self.assertRaises(ValidationError):
            get_user_profile(9999)  