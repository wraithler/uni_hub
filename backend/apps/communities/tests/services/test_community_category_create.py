from django.db import IntegrityError
from django.test import TestCase

from apps.communities.models import CommunityCategory
from apps.communities.services import community_category_create


class CommunityCategoryCreateTests(TestCase):
    def test_community_category_create(self):
        community_category = community_category_create(
            name="Community Category", description="Description"
        )

        self.assertIsNotNone(community_category)
        self.assertEqual(community_category.name, "Community Category")
        self.assertEqual(community_category.description, "Description")
        self.assertEqual(CommunityCategory.objects.count(), 1)
        self.assertEqual(CommunityCategory.objects.first(), community_category)

    def test_community_category_create_with_no_name(self):
        with self.assertRaises(TypeError):
            community_category_create(description="Description")

        with self.assertRaises(IntegrityError):
            community_category_create(name=None, description="Description")

    def test_community_category_create_with_no_description(self):
        with self.assertRaises(TypeError):
            community_category_create(name="Community Category")

        with self.assertRaises(IntegrityError):
            community_category_create(name="Community Category", description=None)

    def test_duplicate_community_category_create(self):
        community_category_create(name="Community Category", description="Description")

        with self.assertRaises(IntegrityError):
            community_category_create(
                name="Community Category", description="Description"
            )
