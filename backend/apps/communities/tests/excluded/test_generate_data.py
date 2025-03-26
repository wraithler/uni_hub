from unittest import skip, TestCase  # noqa

from apps.communities.factories import CommunityFactory, CommunityTagFactory
from apps.posts.factories import PostFactory


# @skip("Only for development purposes")
class GenerateDataTests(TestCase):
    def test_generate_data(self):
        community = CommunityFactory.create(add_tags=CommunityTagFactory.create_batch(3))
        PostFactory.create_batch(10, community=community)
