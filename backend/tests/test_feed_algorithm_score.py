import math
from django.test import TestCase

from api.factories import PostFactory, PostLikeFactory, PostCommentFactory, UserFactory, CommunityFactory


class GetScoreTestCase(TestCase):
    def test_get_score(self):
        user = UserFactory.create()
        community = CommunityFactory.create()
        post = PostFactory.create(community=community)
        user.communities.add(community)

        PostLikeFactory.create_batch(5, post=post)
        PostCommentFactory.create_batch(5, post=post)

        score = post.score(user)
        expected_value = (
                (0.3 * ((5 * 3) + (5 * 5)))
                + (0.2 * (math.exp(-0 / 6)))
                + (0.2 * 10)
                + (0.3 * 0)
        )
        self.assertEqual(score, expected_value)

    def test_post_ordering(self):
        user = UserFactory.create()
        community = CommunityFactory.create()
        post1 = PostFactory.create(community=community)
        post2 = PostFactory.create(community=community)
        user.communities.add(community)

        PostLikeFactory.create_batch(5, post=post1)
        PostCommentFactory.create_batch(5, post=post1)

        PostLikeFactory.create_batch(5, post=post2)
        PostCommentFactory.create_batch(10, post=post2)

        feed = [post1, post2]
        feed.sort(key=lambda x: x.score(user), reverse=True)

        # Post 2 has more comments, so it should be first
        self.assertEqual(feed, [post2, post1])