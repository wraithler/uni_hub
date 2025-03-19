from django.test import TestCase

from apps.communities.selectors import community_category_get
from apps.communities.services import community_category_create


class CommunityCategoryGetTests(TestCase):
    def test_community_category_get_with_no_objects(self):
        community_category = community_category_get(1)

        self.assertIsNone(community_category)

    def test_community_category_get_with_objects(self):
        community_category = community_category_create(
            name="Community Category", description="Description"
        )

        community_category_get_result = community_category_get(community_category.id)

        self.assertIsNotNone(community_category_get_result)
