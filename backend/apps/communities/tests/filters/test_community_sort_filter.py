from django.test import TestCase

from apps.communities.factories import CommunityFactory
from apps.communities.selectors import community_list


class CommunitySortFilterTests(TestCase):
    def test_community_sort_filter_by_name(self):
        CommunityFactory.create(name="Community 2")
        CommunityFactory.create(name="Community 1")

        communities = community_list(filters={"sort_by": "name"})

        self.assertEqual(communities[0].name, "Community 1")
        self.assertEqual(communities[1].name, "Community 2")

    def test_community_sort_filter_by_created_at(self):
        CommunityFactory.create(name="Community 2", created_at="2021-01-01T00:00:00Z")
        CommunityFactory.create(name="Community 3", created_at="2021-01-03T00:00:00Z")
        CommunityFactory.create(name="Community 1", created_at="2021-01-02T00:00:00Z")

        communities = community_list(filters={"sort_by": "created_at"})

        self.assertEqual(communities[0].name, "Community 2")
        self.assertEqual(communities[1].name, "Community 1")
        self.assertEqual(communities[2].name, "Community 3")
