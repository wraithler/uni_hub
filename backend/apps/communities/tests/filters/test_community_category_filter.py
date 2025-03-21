from django.test import TestCase

from apps.communities.factories import CommunityCategoryFactory
from apps.communities.selectors import community_category_list


class CommunityCategoryFilterTests(TestCase):
    def test_community_category_filter_by_name(self):
        CommunityCategoryFactory.create_batch(10)
        CommunityCategoryFactory.create(name="Category 1")

        categories = community_category_list(filters={"name": "Category 1"})

        self.assertEqual(len(categories), 1)
