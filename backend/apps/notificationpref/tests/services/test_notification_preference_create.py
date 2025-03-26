from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.communities.models import Community, CommunityCategory
from apps.notificationpref.services import notification_preference_create

class NotificationPreferenceServiceTest(TestCase):
    
    def setUp(self):

        self.user = BaseUser.objects.create(username="testuser", email="testuser@example.com")
        self.category = CommunityCategory.objects.create(name="Tech")
        self.community1 = Community.objects.create(name="Community1", created_by=self.user, category=self.category)
        self.community2 = Community.objects.create(name="Community2", created_by=self.user, category=self.category)

    def test_create_notification_preference_defaults(self):
        preference = notification_preference_create(user=self.user)

        self.assertIsNotNone(preference)
        self.assertEqual(preference.user, self.user)
        self.assertTrue(preference.event_updates)
        self.assertTrue(preference.post_notifications)
        self.assertTrue(preference.email_notifications)
        self.assertTrue(preference.in_app_notifications)
        self.assertFalse(preference.subscribed_communities.exists())  #

    def test_create_notification_preference_with_communities(self):
        preference = notification_preference_create(user=self.user, subscribed_communities=[self.community1, self.community2])

        self.assertEqual(preference.subscribed_communities.count(), 2)
        self.assertIn(self.community1, preference.subscribed_communities.all())
        self.assertIn(self.community2, preference.subscribed_communities.all())
