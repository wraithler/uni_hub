from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.users.factories import BaseUserFactory
from apps.posts.selectors import post_list_by_user


class PostListByUserTests(TestCase):
    def test_post_list_by_user(self):
        user = BaseUserFactory.create()
        PostFactory.create_batch(5, created_by=user)
        PostFactory.create_batch(5)  # Posts by other users
        posts = post_list_by_user(user_id=user.id)
        self.assertEqual(posts.count(), 5)
