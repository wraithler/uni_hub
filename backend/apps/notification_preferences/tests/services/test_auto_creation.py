from django.test import TestCase

from apps.notification_preferences.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory


class AutoCreationTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()

    def test_preference_auto_created(self):
        pref = UserNotificationPreference.objects.filter(user=self.user).first()
        self.assertIsNotNone(pref, "Notification preference should be auto-created")
