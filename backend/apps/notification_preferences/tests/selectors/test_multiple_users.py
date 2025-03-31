from django.test import TransactionTestCase
from apps.notification_preferences.selectors import user_notification_preference_get
from apps.users.factories import BaseUserFactory
from apps.notification_preferences.models import UserNotificationPreference


class MultipleUsersTests(TransactionTestCase):
    def test_multiple_users_preferences(self):
        users = [BaseUserFactory.create() for _ in range(3)]
        prefs = [UserNotificationPreference.objects.get(user=user) for user in users]

        for user, expected_pref in zip(users, prefs):
            result = user_notification_preference_get(user=user)
            self.assertEqual(result, expected_pref)
