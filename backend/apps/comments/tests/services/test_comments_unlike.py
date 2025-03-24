from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.comments.services import comment_unlike
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.posts.factories import PostFactory


class CommentUnlikeTests(TestCase):
    def test_comment_unlike_success(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()
        community.memberships.create(user=user) 
        comment.likes.create(user=user) 

        comment_unlike(comment=comment, user=user)

        self.assertFalse(comment.likes.filter(user=user).exists()) 

    def test_comment_unlike_no_existing_like(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        comment = CommentFactory.create(post=post)
        user = BaseUserFactory.create()

        comment_unlike(comment=comment, user=user) 

        self.assertFalse(comment.likes.filter(user=user).exists()) 
