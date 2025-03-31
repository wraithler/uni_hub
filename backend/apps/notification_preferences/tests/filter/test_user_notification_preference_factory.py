from django.test import TestCase
from apps.notification_preferences.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory


class UserNotificationPreferenceTestCase(TestCase):
    def test_user_notification_preference_factory(self):
        user = BaseUserFactory.create()

        preference, created = UserNotificationPreference.objects.get_or_create(
            user=user
        )

        self.assertIsNotNone(preference.user)
