from django.test import TransactionTestCase
from django.db import transaction
from apps.notificationpref.selectors import get_user_notification_preference
from apps.notificationpref.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory

class GetPreferenceBasicTests(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        UserNotificationPreference.objects.all().delete()
        BaseUserFactory._meta.model.objects.all().delete()

    def test_get_user_notification_preference_success(self):
        with transaction.atomic():
            user = BaseUserFactory.create()
        
        auto_created_pref = UserNotificationPreference.objects.get(user=user)
        
        result = get_user_notification_preference(user=user)
        self.assertEqual(result, auto_created_pref)
        self.assertEqual(result.user, user)
        self.assertIsInstance(result.email_notifications, bool)
        self.assertIsInstance(result.event_updates, bool)