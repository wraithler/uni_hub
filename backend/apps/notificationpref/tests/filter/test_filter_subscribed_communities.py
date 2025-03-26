from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.communities.models import Community
from apps.communities.models import CommunityCategory  

class UserNotificationPreferenceTestCase(TestCase):
    def test_filter_by_subscribed_communities_direct(self):

        user1 = BaseUser.objects.create(username="user1", email="user1@example.com")

        category = CommunityCategory.objects.create(name="General")


        community1 = Community.objects.create(name="Community1", created_by=user1, category=category)
        community2 = Community.objects.create(name="Community2", created_by=user1, category=category)

        preference, created = UserNotificationPreference.objects.get_or_create(user=user1)
        preference.subscribed_communities.add(community1, community2)  
       
        preferences = UserNotificationPreference.objects.filter(subscribed_communities=community1)

        self.assertEqual(preferences.count(), 1)
        self.assertTrue(community1 in preferences.first().subscribed_communities.all())