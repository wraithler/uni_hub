from django.test import TestCase

from apps.friends.factories import FriendRequestFactory
from apps.friends.selectors import user_sent_friend_request_list
from apps.users.factories import BaseUserFactory


class UserSentFriendRequestListTests(TestCase):
    def test_user_sent_friend_request_list(self):
        user = BaseUserFactory.create()
        requests = FriendRequestFactory.create_batch(10, sender=user)

        result = user_sent_friend_request_list(user_id=user.id)
        self.assertEqual(list(result), requests)
