from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.notification_preferences.services import notification_preference_update
from apps.notification_preferences.models import UserNotificationPreference


class UpdateServiceTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()
        self.pref = UserNotificationPreference.objects.get(user=self.user)

    def test_update_existing_preference(self):
        updated_pref = notification_preference_update(
            notification_preference=self.pref, data={"email_notifications": False}
        )
        self.assertEqual(updated_pref, self.pref)
        self.assertFalse(updated_pref.email_notifications)
