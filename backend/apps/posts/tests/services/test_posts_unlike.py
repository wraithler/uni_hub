from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.posts.services import post_unlike
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory


class PostUnlikeTests(TestCase):
    def test_post_unlike_success(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        user = BaseUserFactory.create()
        community.memberships.create(user=user)
        post.likes.get_or_create(user=user)

        post_unlike(post=post, user=user)

        self.assertFalse(post.likes.filter(user=user).exists())

    def test_post_unlike_no_existing_like(self):
        post = PostFactory.create()
        user = BaseUserFactory.create()

        post_unlike(post=post, user=user)
