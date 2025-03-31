from django.test import TestCase
from apps.friends.services import friend_request_accept
from apps.friends.factories import FriendRequestFactory
from apps.friends.models import Friend


class FriendRequestAcceptServiceTests(TestCase):
    def test_friend_request_accept(self):
        friend_request = FriendRequestFactory.create()

        friend_request_accept(request=friend_request)

        friend_request.refresh_from_db()
        self.assertTrue(friend_request.is_accepted)

        # Ensure friendship is created both ways
        self.assertEqual(Friend.objects.count(), 2)
        self.assertTrue(
            Friend.objects.filter(
                user=friend_request.sender, friend=friend_request.receiver
            ).exists()
        )
        self.assertTrue(
            Friend.objects.filter(
                user=friend_request.receiver, friend=friend_request.sender
            ).exists()
        )
