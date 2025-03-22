from django.test import TestCase

from apps.friends.factories import FriendFactory
from apps.friends.selectors import user_friend_list
from apps.users.factories import BaseUserFactory


class UserFriendListTests(TestCase):
    def test_user_friend_list(self):
        user = BaseUserFactory.create()
        friends = FriendFactory.create_batch(10, user=user)

        result = user_friend_list(user_id=user.id)
        self.assertEqual(list(result), friends)
