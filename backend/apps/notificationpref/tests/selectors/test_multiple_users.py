from django.test import TransactionTestCase
from apps.notificationpref.selectors import user_notification_preference_get
from apps.users.factories import BaseUserFactory
from apps.notificationpref.models import UserNotificationPreference


class MultipleUsersTests(TransactionTestCase):
    reset_sequences = True

    def test_multiple_users_preferences(self):
        users = [BaseUserFactory.create() for _ in range(3)]
        prefs = [UserNotificationPreference.objects.get(user=user) for user in users]
        
        for user, expected_pref in zip(users, prefs):
            result = user_notification_preference_get(user=user)
            self.assertEqual(result, expected_pref)