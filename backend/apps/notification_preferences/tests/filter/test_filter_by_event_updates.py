from django.test import TestCase
from apps.notification_preferences.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory


class UserNotificationPreferenceTestCase(TestCase):
    def test_filter_by_event_updates_direct(self):
        user = BaseUserFactory.create()

        preference, created = UserNotificationPreference.objects.get_or_create(
            user=user, event_updates=True
        )

        preferences = UserNotificationPreference.objects.filter(event_updates=True)

        self.assertEqual(preferences.count(), 1)
        self.assertTrue(preferences.first().event_updates)
