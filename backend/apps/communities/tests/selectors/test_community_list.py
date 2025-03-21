from django.test import TestCase

from apps.communities.factories import CommunityFactory
from apps.communities.selectors import community_list


class CommunityListTests(TestCase):
    def setUp(self):
        CommunityFactory.create_batch(10)

    def test_community_list(self):
        communities = community_list()

        self.assertEqual(len(communities), 10)
