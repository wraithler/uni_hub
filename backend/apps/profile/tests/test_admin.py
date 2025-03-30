from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite
from django.contrib.auth import get_user_model
from django.contrib import messages
from apps.profile.admin import ProfileAdmin
from apps.profile.models import BaseUserProfile
from django.core.exceptions import ValidationError
from django.contrib.messages import get_messages
from django.contrib import admin
from django.http import HttpRequest
from django.test import RequestFactory
from django.contrib.messages.middleware import MessageMiddleware
from django.contrib.sessions.middleware import SessionMiddleware

User = get_user_model()

class ProfileAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = ProfileAdmin(BaseUserProfile, self.site)
        self.factory = RequestFactory()
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password',
            first_name='Admin',
            last_name='User'
        )
        self.test_user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password',
            first_name='Test',
            last_name='User'
        )

    def test_has_delete_permission(self):
        request = self.factory.get('/admin/')
        request.user = self.user
        
        self.assertFalse(self.admin.has_delete_permission(request))
        self.assertFalse(self.admin.has_delete_permission(request, obj=self.test_user))

    def test_list_editable_fields(self):
        self.assertIn('username', self.admin.list_editable)
        self.assertIn('email', self.admin.list_editable)



        
    def test_username_cannot_contain_spaces(self):

        request = self.factory.get('/admin/')
        
        SessionMiddleware(lambda x: None).process_request(request)
        MessageMiddleware(lambda x: None).process_request(request)
        
        user = BaseUserProfile.objects.create(username='test user')
        

        self.admin.save_model(request, user, None, change=False)
        
        from django.contrib.messages import get_messages
        messages = list(get_messages(request))
        self.assertTrue(any("Username cannot contain spaces" in str(m) for m in messages))