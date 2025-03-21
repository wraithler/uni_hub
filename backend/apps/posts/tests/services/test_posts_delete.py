from django.test import TestCase
from apps.posts.models import Post 
from apps.posts.factories import PostFactory
from apps.posts.services import post_delete
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory


class PostDeleteTests(TestCase):
    def test_post_delete_success_by_author(self):
        post = PostFactory.create()
        post_delete(post=post, user=post.created_by)

        self.assertFalse(Post.objects.filter(id=post.id).exists()) 

    def test_post_delete_failure_by_non_author(self):
        post = PostFactory.create()
        other_user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):  
            post_delete(post=post, user=other_user)
