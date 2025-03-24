from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.comments.services import comment_like
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.posts.factories import PostFactory


class CommentLikeTests(TestCase):
    def test_comment_like_success(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()
        community.memberships.create(user=user) 

        comment_like(comment=comment, user=user)

        self.assertTrue(comment.likes.filter(user=user).exists()) 

    def test_comment_like_failure_non_member(self):
        comment = CommentFactory.create()
        user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            comment_like(comment=comment, user=user) 
