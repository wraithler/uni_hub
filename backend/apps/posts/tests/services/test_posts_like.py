from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.posts.services import post_like
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory


class PostLikeTests(TestCase):
    def test_post_like_success(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        user = BaseUserFactory.create()
        community.memberships.create(user=user)

        post_like(post=post, user=user)

        self.assertTrue(post.likes.filter(user=user).exists())

    def test_post_like_failure_non_member(self):
        post = PostFactory.create()
        user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            post_like(post=post, user=user)
