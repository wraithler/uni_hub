from apps.notificationpref.services import notification_preference_update
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.communities.models import Community, CommunityCategory
from django.test import TestCase

class NotificationPreferenceUpdateTest(TestCase):

    def setUp(self):
        self.user = BaseUser.objects.create(username="testuser", email="testuser@example.com")
        self.preference, created = UserNotificationPreference.objects.get_or_create(user=self.user)

    def test_update_notification_preference_boolean_fields(self):

        data = {"event_updates": False, "post_notifications": False}
        updated_preference = notification_preference_update(user=self.user, data=data)

        self.assertFalse(updated_preference.event_updates)
        self.assertFalse(updated_preference.post_notifications)

    def test_update_notification_preference_with_communities(self):

        category = CommunityCategory.objects.create(name="Tech")
        community = Community.objects.create(name="Community1", created_by=self.user, category=category)

        data = {"subscribed_communities": [community]}
        updated_preference = notification_preference_update(user=self.user, data=data)

        self.assertEqual(updated_preference.subscribed_communities.count(), 1)
        self.assertIn(community, updated_preference.subscribed_communities.all())
