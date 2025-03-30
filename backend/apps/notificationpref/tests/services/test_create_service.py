from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.notificationpref.services import create_notification_preference
from apps.notificationpref.models import UserNotificationPreference

class CreateServiceTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()
        UserNotificationPreference.objects.filter(user=self.user).delete()

    def test_create_when_none_exists(self):
        pref = create_notification_preference(user=self.user)
        self.assertEqual(pref.user, self.user)
        self.assertTrue(pref.email_notifications)