import math
from django.test import TestCase

from api.factories import PostFactory, PostLikeFactory, PostCommentFactory, UserFactory, CommunityFactory, FriendFactory


class GetScoreTestCase(TestCase):
    def test_get_score(self):
        # Setup models
        user = UserFactory.create()
        user2 = UserFactory.create()
        FriendFactory.create(user1=user, user2=user2)

        community = CommunityFactory.create()
        post = PostFactory.create(community=community, created_by=user)
        user.communities.add(community)
        user2.communities.add(community)

        PostLikeFactory.create_batch(5, post=post)
        PostCommentFactory.create_batch(5, post=post)

        # Test score
        print(post.likes.count())
        print(post.comments.count())
        print(post.hours_since_posted)
        print(user in user2.friend_list.all())

        score = post.score(user2)

        engagement_expected_value = (5 * 3) + (5 * 5)
        relevance_expected_value = 100
        connection_expected_value = 150
        recency_expected_value = math.exp(-0 / 6)
        scaling_factor = max(1, engagement_expected_value / 100)

        expected_value = (
            0.3 * scaling_factor
            + 0.2 * recency_expected_value
            + 0.2 * relevance_expected_value
            + 0.3 * connection_expected_value
        )
        self.assertEqual(score, expected_value)