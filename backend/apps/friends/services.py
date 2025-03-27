from django.db import transaction
from apps.friends.models import FriendRequest, Friend
from apps.core.exceptions import ApplicationError


@transaction.atomic
def friend_request_send(*, sender, receiver) -> FriendRequest:
    if sender == receiver:
        raise ApplicationError("You cannot send a friend request to yourself.")

    if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
        raise ApplicationError("Friend request already sent.")

    return FriendRequest.objects.create(sender=sender, receiver=receiver)


@transaction.atomic
def friend_request_accept(*, request: FriendRequest) -> None:
    request.is_accepted = True
    request.save()

    Friend.objects.create(user=request.sender, friend=request.receiver)
    Friend.objects.create(user=request.receiver, friend=request.sender)


@transaction.atomic
def friend_request_decline(*, request: FriendRequest) -> None:
    request.is_declined = True
    request.save()
