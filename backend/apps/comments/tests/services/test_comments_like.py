from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.comments.services import comment_like_create, comment_like_delete
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.posts.factories import PostFactory


class CommentLikeTests(TestCase):
    def test_comment_like_create_success(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()
        community.memberships.create(user=user) 

        like = comment_like_create(comment=comment, user=user)

        self.assertTrue(comment.likes.filter(user=user).exists())
        self.assertEqual(like.comment, comment)
        self.assertEqual(like.user, user)

    def test_comment_like_create_failure_non_member(self):
        comment = CommentFactory.create()
        user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            comment_like_create(comment=comment, user=user)

    def test_comment_like_duplicate_prevention(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()
        community.memberships.create(user=user)

        first_like = comment_like_create(comment=comment, user=user)

        second_like = comment_like_create(comment=comment, user=user)

        self.assertEqual(comment.likes.filter(user=user).count(), 1)
        self.assertEqual(first_like, second_like)

    def test_comment_like_delete(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()
        community.memberships.create(user=user)

        comment_like_create(comment=comment, user=user)

        comment_like_delete(comment=comment, user=user)

        self.assertFalse(comment.likes.filter(user=user).exists())

    def test_comment_like_delete_nonexistent(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()
        community.memberships.create(user=user)

        comment_like_delete(comment=comment, user=user)