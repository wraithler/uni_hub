from django.test import TestCase
from apps.posts.models import Post
from apps.posts.services import post_create
from apps.communities.factories import CommunityFactory
from apps.users.factories import BaseUserFactory
from apps.core.exceptions import ApplicationError


class PostCreateTests(TestCase):
    def test_post_create_success(self):
        community = CommunityFactory.create()
        user = BaseUserFactory.create()
        community.memberships.create(user=user)

        post = post_create(
            title="Test Title",
            content="Test Content",
            community_id=community.id,
            created_by=user,
        )

        self.assertIsInstance(post, Post)
        self.assertEqual(post.title, "Test Title")
        self.assertEqual(post.content, "Test Content")

    def test_post_create_failure_non_member(self):
        community = CommunityFactory.create()
        user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            post_create(
                title="Test Title",
                content="Test Content",
                community_id=community.id,
                created_by=user,
            )
