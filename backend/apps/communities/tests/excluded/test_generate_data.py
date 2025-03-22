from unittest import skip, TestCase  # noqa

from apps.communities.factories import CommunityFactory

# @skip("Only for development purposes")
class GenerateDataTests(TestCase):
    def test_generate_data(self):
        CommunityFactory.create_batch(100)