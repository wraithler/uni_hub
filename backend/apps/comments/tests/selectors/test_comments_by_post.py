from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.posts.factories import PostFactory
from apps.comments.selectors import comment_list_by_post


class CommentListByPostTests(TestCase):
    def test_comment_list_by_post(self):
        post = PostFactory.create()
        CommentFactory.create_batch(3, post=post)
        CommentFactory.create_batch(2)  # Comments for other posts
        comments = comment_list_by_post(post_id=post.id)
        self.assertEqual(comments.count(), 3)
