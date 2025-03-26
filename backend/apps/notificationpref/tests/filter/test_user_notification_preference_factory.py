from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser

class UserNotificationPreferenceTestCase(TestCase):
    
    def test_user_notification_preference_factory(self):

        user = BaseUser.objects.create(username="unique_user")

        preference, created = UserNotificationPreference.objects.get_or_create(user=user)

        if created:
            print(f"Created new preference with ID: {preference.id}")
        else:
            print(f"Found existing preference with ID: {preference.id}")
        
        self.assertIsNotNone(preference.user)