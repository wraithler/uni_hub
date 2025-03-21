from django.test import TestCase

from apps.communities.factories import CommunityCategoryFactory
from apps.communities.services import community_create, community_update
from apps.users.factories import BaseUserFactory


class CommunityUpdateTests(TestCase):
    def setUp(self):
        self.community = community_create(
            name="Community",
            description="Description",
            category=CommunityCategoryFactory.create(),
            created_by=BaseUserFactory.create(),
        )

    def test_community_update(self):
        community = community_update(
            community=self.community,
            data={"name": "New Name", "description": "New Description"},
        )

        self.assertEqual(community.name, "New Name")
        self.assertEqual(community.description, "New Description")
        self.assertEqual(community.category, self.community.category)
        self.assertEqual(community.created_by, self.community.created_by)
        self.assertEqual(community.emoji, self.community.emoji)
        self.assertEqual(community.memberships.count(), 1)
        self.assertEqual(community.memberships.first().user, self.community.created_by)

    def test_community_update_with_no_data(self):
        community = community_update(community=self.community, data={})

        self.assertEqual(community.name, "Community")
        self.assertEqual(community.description, "Description")
        self.assertEqual(community.category, self.community.category)
        self.assertEqual(community.created_by, self.community.created_by)
        self.assertEqual(community.emoji, self.community.emoji)
        self.assertEqual(community.memberships.count(), 1)
        self.assertEqual(community.memberships.first().user, self.community.created_by)
