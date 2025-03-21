from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.posts.services import post_update
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory


class PostUpdateTests(TestCase):
    def test_post_update_success_by_author(self):
        post = PostFactory.create(title="Old Title", content="Old Content")
        data = {"title": "New Title", "content": "New Content", "user": post.created_by}

        updated_post = post_update(post=post, data=data)

        self.assertEqual(updated_post.title, "New Title")
        self.assertEqual(updated_post.content, "New Content")

    def test_post_update_failure_by_non_author(self):
        post = PostFactory.create()
        other_user = BaseUserFactory.create()
        data = {"title": "New Title", "content": "New Content", "user": other_user}

        with self.assertRaises(ApplicationError):
            post_update(post=post, data=data)
