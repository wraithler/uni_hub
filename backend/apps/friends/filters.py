import django_filters
from apps.friends.models import FriendRequest


class FriendRequestFilter(django_filters.FilterSet):
    class Meta:
        model = FriendRequest
        fields = ("is_accepted", "is_declined", "sender")
