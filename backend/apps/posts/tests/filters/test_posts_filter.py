from django.test import TestCase
from apps.posts.factories import PostFactory
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.posts.selectors import post_list


class PostFilterTests(TestCase):
    def test_post_filter_by_title(self):
        PostFactory.create(title="Post 1")
        PostFactory.create(title="Post 2")

        posts = post_list(filters={"title": "Post 1"})

        self.assertEqual(len(posts), 1)

    def test_post_filter_by_content(self):
        PostFactory.create(content="This is post content 1.")
        PostFactory.create(content="This is different content.")

        posts = post_list(filters={"content": "This is post content 1."})

        self.assertEqual(len(posts), 1)

    def test_post_filter_by_created_by(self):
        user = BaseUserFactory.create()
        PostFactory.create_batch(5, created_by=user)
        PostFactory.create_batch(5)

        posts = post_list(filters={"created_by": user})

        self.assertEqual(len(posts), 5)

    def test_post_filter_by_community(self):
        community = CommunityFactory.create()
        PostFactory.create_batch(10, community=community)
        PostFactory.create_batch(5)

        posts = post_list(filters={"community__name": community.name})

        self.assertEqual(len(posts), 10)

    def test_post_filter_by_combined(self):
        community = CommunityFactory.create()
        user = BaseUserFactory.create()
        PostFactory.create_batch(5, community=community, created_by=user)
        PostFactory.create_batch(10)

        posts = post_list(
            filters={"community__name": community.name, "created_by": user}
        )

        self.assertEqual(len(posts), 5)
