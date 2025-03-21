from django.db import IntegrityError
from django.test import TestCase

from apps.communities.factories import CommunityCategoryFactory
from apps.communities.services import community_create
from apps.users.factories import BaseUserFactory


class CommunityCreateTests(TestCase):
    def test_community_create(self):
        category = CommunityCategoryFactory.create()
        user = BaseUserFactory.create()
        community = community_create(
            name="Community",
            description="Description",
            category=category,
            created_by=user,
            emoji="👍",
        )

        self.assertIsNotNone(community)
        self.assertEqual(community.name, "Community")
        self.assertEqual(community.description, "Description")
        self.assertEqual(community.category, category)
        self.assertEqual(community.created_by, user)
        self.assertEqual(community.emoji, "👍")
        self.assertEqual(community.memberships.count(), 1)
        self.assertEqual(community.memberships.first().user, user)

    def test_community_create_with_no_name(self):
        with self.assertRaises(TypeError):
            community_create(
                description="Description",
                category=CommunityCategoryFactory.create(),
                created_by=BaseUserFactory.create(),
            )

        with self.assertRaises(IntegrityError):
            community_create(
                name=None,
                description="Description",
                category=CommunityCategoryFactory.create(),
                created_by=BaseUserFactory.create(),
            )

    def test_community_create_with_no_description(self):
        with self.assertRaises(TypeError):
            community_create(
                name="Community",
                category=CommunityCategoryFactory.create(),
                created_by=BaseUserFactory.create(),
            )

        with self.assertRaises(IntegrityError):
            community_create(
                name="Community",
                description=None,
                category=CommunityCategoryFactory.create(),
                created_by=BaseUserFactory.create(),
            )

    def test_community_create_with_no_category(self):
        with self.assertRaises(TypeError):
            community_create(
                name="Community",
                description="Description",
                created_by=BaseUserFactory.create(),
            )

        with self.assertRaises(IntegrityError):
            community_create(
                name="Community",
                description="Description",
                category=None,
                created_by=BaseUserFactory.create(),
            )

    def test_duplicate_community_create(self):
        category = CommunityCategoryFactory.create()
        user = BaseUserFactory.create()
        community_create(
            name="Community",
            description="Description",
            category=category,
            created_by=user,
        )

        with self.assertRaises(IntegrityError):
            community_create(
                name="Community",
                description="Description",
                category=category,
                created_by=user,
            )
