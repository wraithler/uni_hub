from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser

class UserNotificationPreferenceTestCase(TestCase):
    
    def test_filter_by_username_direct(self):

        user1 = BaseUser.objects.create(username="unique_user1", email="unique_user1@example.com")
        user2 = BaseUser.objects.create(username="unique_user2", email="unique_user2@example.com")
        

        preference1, created1 = UserNotificationPreference.objects.get_or_create(user=user1)
        preference2, created2 = UserNotificationPreference.objects.get_or_create(user=user2)

        preferences = UserNotificationPreference.objects.filter(user__username="unique_user1")

        self.assertEqual(preferences.count(), 1)
        self.assertEqual(preferences.first().user.username, "unique_user1")