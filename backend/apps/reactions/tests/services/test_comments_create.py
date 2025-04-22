from django.test import TestCase
from apps.reactions.models import Comment
from apps.reactions.services import comment_create
from apps.posts.factories import PostFactory
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.core.exceptions import ApplicationError


class CommentCreateTests(TestCase):
    def test_comment_create_success(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        user = BaseUserFactory.create()
        community.memberships.create(user=user)

        comment = comment_create(
            content="Test Comment", post_id=post.id, created_by=user
        )

        self.assertIsInstance(comment, Comment)
        self.assertEqual(comment.content, "Test Comment")
        self.assertEqual(comment.post, post)
        self.assertEqual(comment.created_by, user)

    def test_comment_create_failure_non_member(self):
        post = PostFactory.create()
        user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            comment_create(
                content="Unauthorized Comment", post_id=post.id, created_by=user
            )
