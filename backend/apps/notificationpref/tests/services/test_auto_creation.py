from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.notificationpref.models import UserNotificationPreference

class AutoCreationTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()

    def test_preference_auto_created(self):
        pref = UserNotificationPreference.objects.filter(user=self.user).first()
        self.assertIsNotNone(pref, "Notification preference should be auto-created")