from django.db.models import QuerySet

from apps.friends.models import Friend, FriendRequest


def user_friend_list(*, user_id) -> QuerySet[Friend]:
    qs = Friend.objects.filter(user_id=user_id)

    return qs


def user_sent_friend_request_list(*, user_id) -> QuerySet[Friend]:
    qs = FriendRequest.objects.filter(sender_id=user_id)

    return qs


def user_received_friend_request_list(*, user_id) -> QuerySet[Friend]:
    qs = FriendRequest.objects.filter(receiver_id=user_id)

    return qs
