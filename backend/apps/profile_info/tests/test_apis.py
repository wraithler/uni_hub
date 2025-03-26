from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class ProfileInfoAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            first_name='Test',  
            last_name='User'  
        )
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_get_profile(self):
        response = self.client.get(reverse('profile-current'))
        self.assertEqual(response.status_code, 200)

    def test_update_profile(self):
        data = {'first_name': 'Updated'}
        response = self.client.patch(reverse('profile-current'), data)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

    def test_invalid_username(self):
        data = {'username': 'test user'}
        response = self.client.patch(reverse('profile-current'), data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('cannot contain spaces', str(response.data))

    def test_unauthorized_access(self):
        other_user = User.objects.create_user(
            username='other',
            email='other@example.com',
            password='password',
            first_name='Other',  
            last_name='User'     
        )
        
        response = self.client.patch(
            reverse('profile-detail', kwargs={'user_id': other_user.id}),
            {'first_name': 'Hacked'}
        )
        self.assertEqual(response.status_code, 403)