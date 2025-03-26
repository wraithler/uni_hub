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

    def test_update_user_profile(self):
    
        updated_data = {
            'username': 'updateduser',
            'email': 'updateduser@example.com',
            'first_name': 'Updated',
            'last_name': 'User'
        }
        
        update_user_profile(self.user, updated_data)
        
        self.user.refresh_from_db()

        self.assertEqual(self.user.username, 'updateduser')
        self.assertEqual(self.user.email, 'updateduser@example.com')
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.last_name, 'User')
