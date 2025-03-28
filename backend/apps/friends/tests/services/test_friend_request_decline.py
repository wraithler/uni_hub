from django.test import TestCase
from apps.friends.services import friend_request_decline
from apps.friends.factories import FriendRequestFactory


class FriendRequestDeclineServiceTests(TestCase):
    def test_friend_request_decline(self):
        friend_request = FriendRequestFactory.create()

        friend_request_decline(request=friend_request)

        friend_request.refresh_from_db()
        self.assertTrue(friend_request.is_declined)
