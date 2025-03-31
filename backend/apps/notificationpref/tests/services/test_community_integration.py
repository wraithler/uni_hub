from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.communities.models import Community, CommunityCategory
from apps.notificationpref.services import notification_preference_create
from apps.notificationpref.models import UserNotificationPreference


class CommunityIntegrationTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()
        self.category = CommunityCategory.objects.create(name="Test Category")
        self.community = Community.objects.create(
            name="Test Community",
            description="Test Description",
            category=self.category,
            created_by=self.user,
            is_featured=False,
            about="Test About",
        )
        UserNotificationPreference.objects.filter(user=self.user).delete()

    def test_create_with_communities(self):
        pref = notification_preference_create(
            user=self.user, subscribed_communities=[self.community]
        )
        self.assertEqual(pref.subscribed_communities.count(), 1)
        self.assertEqual(pref.subscribed_communities.first(), self.community)
