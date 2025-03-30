from django.test import TestCase

from apps.friends.factories import FriendRequestFactory
from apps.friends.selectors import get_sent_friend_requests
from apps.users.factories import BaseUserFactory


class GetSentFriendRequestsTests(TestCase):
    def test_get_sent_friend_requests(self):
        sender = BaseUserFactory.create()
        other_user = BaseUserFactory.create()

        expected_requests = FriendRequestFactory.create_batch(4, sender=sender)
        FriendRequestFactory.create_batch(2, sender=other_user)

        result = get_sent_friend_requests(user_id=sender.id)
        self.assertEqual(set(result), set(expected_requests))
