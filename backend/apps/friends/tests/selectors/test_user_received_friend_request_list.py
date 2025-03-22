from django.test import TestCase

from apps.friends.factories import FriendRequestFactory
from apps.friends.selectors import user_received_friend_request_list
from apps.users.factories import BaseUserFactory


class UserReceivedFriendRequestListTests(TestCase):
    def test_user_received_friend_request_list(self):
        user = BaseUserFactory.create()
        requests = FriendRequestFactory.create_batch(10, receiver=user)

        result = user_received_friend_request_list(user_id=user.id)
        self.assertEqual(list(result), requests)
