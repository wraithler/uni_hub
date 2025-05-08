from apps.friends.models import FriendRequest, Friend

def get_received_friend_requests(user):
    return FriendRequest.objects.filter(receiver=user, is_accepted=False)

def get_user_friends(user):
    friend_links = Friend.objects.filter(user=user).select_related("friend")
    return [f.friend for f in friend_links]
