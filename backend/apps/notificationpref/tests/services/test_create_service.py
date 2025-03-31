from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.notificationpref.services import notification_preference_create
from apps.notificationpref.models import UserNotificationPreference

class CreateServiceTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()
        UserNotificationPreference.objects.filter(user=self.user).delete()

    def test_create_when_none_exists(self):
        pref = notification_preference_create(user=self.user)
        self.assertEqual(pref.user, self.user)
        self.assertTrue(pref.email_notifications)