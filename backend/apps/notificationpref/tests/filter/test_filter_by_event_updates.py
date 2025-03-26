from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser

class UserNotificationPreferenceTestCase(TestCase):
    def test_filter_by_event_updates_direct(self):
  
        user1 = BaseUser.objects.create(username="unique_user1", email="unique_user1@example.com")
        

        preference, created = UserNotificationPreference.objects.get_or_create(user=user1, event_updates=True)
        

        preferences = UserNotificationPreference.objects.filter(event_updates=True)
        
     
        self.assertEqual(preferences.count(), 1)
        self.assertTrue(preferences.first().event_updates)