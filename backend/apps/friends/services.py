from django.db import transaction
from apps.friends.models import FriendRequest, Friend


def send_friend_request(sender, receiver):
    existing = FriendRequest.objects.filter(sender=sender, receiver=receiver).first()
    if existing:
        if existing.is_accepted:
            return "Already friends"
        return "Request already sent"

    reverse = FriendRequest.objects.filter(sender=receiver, receiver=sender).first()
    if reverse:
        return "They already sent you a request"

    FriendRequest.objects.create(sender=sender, receiver=receiver)
    return "Friend request sent"


@transaction.atomic
def accept_friend_request(current_user, request_id):
    try:
        fr = FriendRequest.objects.get(id=request_id, receiver=current_user, is_accepted=False)
    except FriendRequest.DoesNotExist:
        return False

    fr.is_accepted = True
    fr.save()

    Friend.objects.bulk_create([
        Friend(user=fr.sender, friend=fr.receiver),
        Friend(user=fr.receiver, friend=fr.sender),
    ])

    return True


@transaction.atomic
def unfriend_users(user_id, friend_id):
    deleted1 = Friend.objects.filter(user_id=user_id, friend_id=friend_id).delete()
    deleted2 = Friend.objects.filter(user_id=friend_id, friend_id=user_id).delete()

    FriendRequest.objects.filter(sender_id=user_id, receiver_id=friend_id).delete()
    FriendRequest.objects.filter(sender_id=friend_id, receiver_id=user_id).delete()

    return deleted1[0] > 0 and deleted2[0] > 0
