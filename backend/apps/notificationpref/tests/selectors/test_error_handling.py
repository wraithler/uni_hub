from django.test import TestCase
from apps.notificationpref.selectors import user_notification_preference_get
from apps.notificationpref.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

class GetPreferenceErrorTests(TestCase):

    def setUp(self):
        UserNotificationPreference.objects.all().delete()
        self.user = BaseUserFactory.create()
        self.preference = UserNotificationPreference.objects.get(user=self.user)
    
    def test_retrieve_existing_preference(self):
        result = user_notification_preference_get(user=self.user)
        self.assertEqual(result, self.preference)
        self.assertEqual(result.user, self.user)
    
    def user_notification_preference_get(*, user):
        return UserNotificationPreference.objects.get(user=user)
        
    def test_returns_correct_model_type(self):
        result = user_notification_preference_get(user=self.user)
        self.assertIsInstance(result, UserNotificationPreference)

    def test_retrieves_user_notification_preference_successfully(self):
        with transaction.atomic():
            user = BaseUserFactory.create()
        
        auto_created_pref = UserNotificationPreference.objects.get(user=user)
        
        result = user_notification_preference_get(user=user)
        self.assertEqual(result, auto_created_pref)
        self.assertEqual(result.user, user)
        self.assertIsInstance(result.email_notifications, bool)
        self.assertIsInstance(result.event_updates, bool)