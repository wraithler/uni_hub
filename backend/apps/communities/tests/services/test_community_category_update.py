from django.test import TestCase

from apps.communities.services import (
    community_category_create,
    community_category_update,
)


class CommunityCategoryUpdateTests(TestCase):
    def setUp(self):
        self.community_category = community_category_create(
            name="Community Category", description="Description"
        )

    def test_community_category_update(self):
        community_category = community_category_update(
            community_category=self.community_category, data={"name": "New Name"}
        )

        self.assertEqual(community_category.name, "New Name")
        self.assertEqual(community_category.description, "Description")

    def test_community_category_update_with_no_data(self):
        community_category = community_category_update(
            community_category=self.community_category, data={}
        )

        self.assertEqual(community_category.name, "Community Category")
        self.assertEqual(community_category.description, "Description")
