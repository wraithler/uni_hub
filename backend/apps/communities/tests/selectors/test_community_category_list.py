from django.test import TestCase

from apps.communities.factories import CommunityCategoryFactory
from apps.communities.selectors import community_category_list


class CommunityCategoryListTests(TestCase):
    def setUp(self):
        CommunityCategoryFactory.create_batch(10)

    def test_community_category_list(self):
        community_categories = community_category_list()

        self.assertEqual(len(community_categories), 10)
