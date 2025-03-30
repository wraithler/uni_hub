from django.test import TransactionTestCase
from apps.notificationpref.selectors import get_user_notification_preference
from apps.users.factories import BaseUserFactory
from apps.notificationpref.models import UserNotificationPreference


class MultipleUsersTests(TransactionTestCase):
    reset_sequences = True

    def test_multiple_users_preferences(self):
        users = [BaseUserFactory.create() for _ in range(3)]
        prefs = [UserNotificationPreference.objects.get(user=user) for user in users]
        
        for user, expected_pref in zip(users, prefs):
            result = get_user_notification_preference(user=user)
            self.assertEqual(result, expected_pref)