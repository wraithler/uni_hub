from django.test import TestCase

from apps.communities.factories import CommunityFactory, CommunityCategoryFactory
from apps.communities.selectors import community_list


class CommunityFilterTests(TestCase):
    def test_community_filter_by_is_private(self):
        CommunityFactory.create_batch(10, is_private=False)
        CommunityFactory.create_batch(10, is_private=True)

        private_communities = community_list(filters={"is_private": True})
        public_communities = community_list(filters={"is_private": False})

        self.assertEqual(len(private_communities), 10)
        self.assertEqual(len(public_communities), 10)

    def test_community_filter_by_name(self):
        CommunityFactory.create(name="Community 1")
        CommunityFactory.create(name="Community 2")

        communities = community_list(filters={"name": "Community 1"})

        self.assertEqual(len(communities), 1)

    def test_community_filter_by_category(self):
        category = CommunityCategoryFactory.create()
        CommunityFactory.create(category=category)

        communities = community_list(filters={"category": category})

        self.assertEqual(len(communities), 1)

    def test_community_filter_by_combined(self):
        category = CommunityCategoryFactory.create()
        CommunityFactory.create_batch(10, category=category, is_private=False)
        CommunityFactory.create_batch(10, category=category, is_private=True)

        private_communities = community_list(
            filters={"category": category, "is_private": True}
        )
        public_communities = community_list(
            filters={"category": category, "is_private": False}
        )

        self.assertEqual(len(private_communities), 10)
        self.assertEqual(len(public_communities), 10)
