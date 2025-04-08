from django.test import TestCase
from apps.reactions.factories import CommentFactory
from apps.users.factories import BaseUserFactory
from apps.posts.factories import PostFactory
from apps.communities.factories import CommunityFactory
from apps.reactions.selectors import comment_list


class CommentFilterTests(TestCase):
    def test_comment_filter_by_content(self):
        CommentFactory.create(content="This is comment content 1.")
        CommentFactory.create(content="This is different content.")
        comments = comment_list(filters={"content": "This is comment content 1."})
        self.assertEqual(len(comments), 1)

    def test_comment_filter_by_created_by(self):
        user = BaseUserFactory.create()
        CommentFactory.create_batch(5, created_by=user)
        CommentFactory.create_batch(5)
        comments = comment_list(filters={"created_by": user})
        self.assertEqual(len(comments), 5)

    def test_comment_filter_by_post(self):
        post = PostFactory.create()
        CommentFactory.create_batch(10, post=post)
        CommentFactory.create_batch(5)
        comments = comment_list(filters={"post__id": post.id})
        self.assertEqual(len(comments), 15)

    def test_comment_filter_by_community(self):
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        CommentFactory.create_batch(10, post=post)
        CommentFactory.create_batch(5)
        comments = comment_list(filters={"post__community__name": community.name})
        self.assertEqual(len(comments), 10)

    def test_comment_filter_by_combined(self):
        user = BaseUserFactory.create()
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        CommentFactory.create_batch(5, created_by=user, post=post)
        CommentFactory.create_batch(10)
        comments = comment_list(
            filters={"created_by": user, "post__community__name": community.name}
        )
        self.assertEqual(len(comments), 5)
