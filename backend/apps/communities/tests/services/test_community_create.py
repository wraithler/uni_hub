from django.db import IntegrityError
from django.test import TestCase

from apps.communities.factories import CommunityCategoryFactory
from apps.communities.services import community_create
from apps.users.factories import BaseUserFactory


class CommunityCreateTests(TestCase):
    def test_community_create(self):
        user = BaseUserFactory.create()
        community = community_create(
            name="Community",
            description="Description",
            created_by=user,
            emoji="👍",
            categories=[CommunityCategoryFactory.create()],
        )

        self.assertIsNotNone(community)
        self.assertEqual(community.name, "Community")
        self.assertEqual(community.description, "Description")
        self.assertEqual(community.created_by, user)
        self.assertEqual(community.categories.count(), 1)
        self.assertEqual(community.emoji, "👍")
        self.assertEqual(community.memberships.count(), 1)
        self.assertEqual(community.memberships.first().user, user)

    def test_community_create_with_no_name(self):
        with self.assertRaises(TypeError):
            community_create(
                description="Description",
                created_by=BaseUserFactory.create(),
                categories=[CommunityCategoryFactory.create()],
            )

        with self.assertRaises(IntegrityError):
            community_create(
                name=None,
                description="Description",
                created_by=BaseUserFactory.create(),
                categories=[CommunityCategoryFactory.create()],
            )

    def test_community_create_with_no_description(self):
        with self.assertRaises(TypeError):
            community_create(
                name="Community",
                created_by=BaseUserFactory.create(),
                categories=[CommunityCategoryFactory.create()],
            )

        with self.assertRaises(IntegrityError):
            community_create(
                name="Community",
                description=None,
                categories=[CommunityCategoryFactory.create()],
                created_by=BaseUserFactory.create(),
            )

    def test_community_create_with_no_category(self):
        with self.assertRaises(TypeError):
            community_create(
                name="Community",
                description="Description",
                created_by=BaseUserFactory.create(),
            )

        with self.assertRaises(TypeError):
            community_create(
                name="Community",
                description="Description",
                categories=None,
                created_by=BaseUserFactory.create(),
            )

    def test_duplicate_community_create(self):
        category = CommunityCategoryFactory.create()
        user = BaseUserFactory.create()
        community_create(
            name="Community",
            description="Description",
            categories=[category],
            created_by=user,
        )

        with self.assertRaises(IntegrityError):
            community_create(
                name="Community",
                description="Description",
                categories=[category],
                created_by=user,
            )

    def test_community_create_multiple_categories(self):
        categories = CommunityCategoryFactory.create_batch(3)

        category = community_create(
            name="Community",
            description="Description",
            categories=categories,
            created_by=BaseUserFactory.create(),
        )

        self.assertEqual(category.categories.count(), 3)
        self.assertEqual(category.categories.all()[0], categories[0])
        self.assertEqual(category.categories.all()[1], categories[1])
        self.assertEqual(category.categories.all()[2], categories[2])