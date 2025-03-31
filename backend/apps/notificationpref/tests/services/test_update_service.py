from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.notificationpref.services import notification_preference_update
from apps.notificationpref.models import UserNotificationPreference

class UpdateServiceTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()
        self.pref = UserNotificationPreference.objects.get(user=self.user)

    def test_update_existing_preference(self):
        updated_pref = notification_preference_update(
            user=self.user,
            data={'email_notifications': False}
        )
        self.assertEqual(updated_pref, self.pref)
        self.assertFalse(updated_pref.email_notifications)