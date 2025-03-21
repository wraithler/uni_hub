from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.posts.selectors import post_get


class PostGetTests(TestCase):
    def test_post_get_with_no_objects(self):
        post = post_get(1)
        self.assertIsNone(post)

    def test_post_get_with_objects(self):
        post = PostFactory.create(title="Test Post")
        post_get_result = post_get(post.id)
        self.assertIsNotNone(post_get_result)
        self.assertEqual(post_get_result.title, "Test Post")
