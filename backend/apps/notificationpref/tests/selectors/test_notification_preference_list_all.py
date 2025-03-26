from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.notificationpref.selectors import (
    notification_preference_list,
)

class NotificationPreferenceSelectorTestCase(TestCase):
    
    def setUp(self):
        UserNotificationPreference.objects.all().delete()

        self.user1 = BaseUser.objects.create(username="unique_user1", email="unique_user1@example.com")
        self.user2 = BaseUser.objects.create(username="unique_user2", email="unique_user2@example.com")
        

        self.preference1 = UserNotificationPreference.objects.filter(user=self.user1).first()
        if not self.preference1:
            self.preference1 = UserNotificationPreference.objects.create(user=self.user1, event_updates=True)

        self.preference2 = UserNotificationPreference.objects.filter(user=self.user2).first()
        if not self.preference2:
            self.preference2 = UserNotificationPreference.objects.create(user=self.user2, event_updates=False)


    def test_notification_preference_list_all(self):
        preferences = notification_preference_list()
        self.assertEqual(preferences.count(), 2)