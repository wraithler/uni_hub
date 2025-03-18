from django.test import TestCase

from apps.communities.factories import CommunityCategoryFactory
from apps.communities.selectors import community_get
from apps.communities.services import community_create
from apps.users.factories import BaseUserFactory


class CommunityGetTests(TestCase):
    def test_community_get_with_no_objects(self):
        community = community_get(1)

        self.assertIsNone(community)

    def test_community_get_with_objects(self):
        community = community_create(
            name="Community",
            description="Description",
            created_by=BaseUserFactory.create(),
            category=CommunityCategoryFactory.create()
        )

        community_get_result = community_get(community.id)

        self.assertIsNotNone(community_get_result)

