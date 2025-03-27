from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.communities.factories import CommunityFactory
from apps.posts.selectors import post_list_by_community


class PostListByCommunityTests(TestCase):
    def test_post_list_by_community(self):
        community = CommunityFactory.create()
        PostFactory.create_batch(10, community=community)
        PostFactory.create_batch(5)
        posts = post_list_by_community(community_id=community.id)
        self.assertEqual(posts.count(), 10)
