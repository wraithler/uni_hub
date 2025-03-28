from django.test import TestCase
from apps.friends.services import friend_request_send
from apps.friends.factories import FriendRequestFactory
from apps.users.factories import BaseUserFactory
from apps.core.exceptions import ApplicationError


class FriendRequestSendServiceTests(TestCase):
    def test_friend_request_send(self):
        sender = BaseUserFactory.create()
        receiver = BaseUserFactory.create()

        friend_request = friend_request_send(sender=sender, receiver=receiver)

        self.assertEqual(friend_request.sender, sender)
        self.assertEqual(friend_request.receiver, receiver)
        self.assertFalse(friend_request.is_accepted)
        self.assertFalse(friend_request.is_declined)

    def test_friend_request_send_duplicate_raises(self):
        sender = BaseUserFactory.create()
        receiver = BaseUserFactory.create()
        FriendRequestFactory.create(sender=sender, receiver=receiver)

        with self.assertRaises(ApplicationError):
            friend_request_send(sender=sender, receiver=receiver)
