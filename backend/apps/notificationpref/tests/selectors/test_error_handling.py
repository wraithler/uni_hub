from django.test import TransactionTestCase
from django.db import transaction
from apps.notificationpref.selectors import get_user_notification_preference
from apps.notificationpref.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory

class GetPreferenceErrorTests(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        UserNotificationPreference.objects.all().delete()

    def test_get_user_notification_preference_not_found(self):
        with transaction.atomic():
            new_user = BaseUserFactory.create()
            UserNotificationPreference.objects.filter(user=new_user).delete()

        self.assertFalse(
            UserNotificationPreference.objects.filter(user=new_user).exists(),
        )
        
        with self.assertRaises(Exception) as context:
            get_user_notification_preference(user=new_user)
        
        self.assertIn("No preferences found", str(context.exception))