from django.test import TestCase

from apps.notificationpref.models import UserNotificationPreference
from apps.notificationpref.selectors import user_notification_preference_get
from apps.users.factories import BaseUserFactory


class PreferenceUpdateTests(TestCase):
    def test_updated_preferences(self):
        user = BaseUserFactory.create()

        original_pref = UserNotificationPreference.objects.get(user=user)

        original_pref.email_notifications = False
        original_pref.save()

        result = user_notification_preference_get(user=user)
        self.assertFalse(result.email_notifications)
        self.assertEqual(result.updated_at, original_pref.updated_at)
