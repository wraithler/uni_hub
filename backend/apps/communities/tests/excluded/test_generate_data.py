from unittest import skip, TestCase  # noqa

from apps.communities.models import Community
from apps.events.factories import EventFactory
from apps.posts.factories import PostFactory


# @skip("Only for development purposes")
class GenerateDataTests(TestCase):
    def test_generate_data(self):
        # Generate 100 posts and 10 events with random created_at dates
        for i in range(100):
            if i % 5 != 0:
                PostFactory.create(community=Community.objects.first())
            else:
                EventFactory.create(community=Community.objects.first())