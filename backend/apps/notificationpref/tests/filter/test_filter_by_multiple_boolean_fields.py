from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory


class UserNotificationPreferenceTestCase(TestCase):
    def test_filter_by_multiple_boolean_fields_direct(self):
        user = BaseUserFactory.create()

        preference, created = UserNotificationPreference.objects.get_or_create(
            user=user
        )

        preference.event_updates = True
        preference.post_notifications = False
        preference.save()

        preferences = UserNotificationPreference.objects.filter(
            event_updates=True, post_notifications=False
        )

        self.assertEqual(preferences.count(), 1)
        self.assertTrue(preferences.first().event_updates)
        self.assertFalse(preferences.first().post_notifications)
