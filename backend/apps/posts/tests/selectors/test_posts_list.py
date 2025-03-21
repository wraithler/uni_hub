from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.posts.selectors import post_list


class PostListTests(TestCase):
    def test_post_list_without_filters(self):
        PostFactory.create_batch(5)
        posts = post_list(filters={})
        self.assertEqual(posts.count(), 5)

    def test_post_list_with_filters(self):
        PostFactory.create(title="Specific Post", content="Content")
        PostFactory.create(title="Another Post", content="Other Content")
        posts = post_list(filters={"title": "Specific Post"})
        self.assertEqual(posts.count(), 1)
        self.assertEqual(posts.first().content, "Content")
