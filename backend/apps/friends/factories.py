import factory

from apps.friends.models import Friend, FriendRequest
from apps.users.factories import BaseUserFactory


class FriendFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Friend

    user = factory.SubFactory(BaseUserFactory)
    friend = factory.SubFactory(BaseUserFactory)


class FriendRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FriendRequest

    sender = factory.SubFactory(BaseUserFactory)
    receiver = factory.SubFactory(BaseUserFactory)
    is_accepted = False
    is_declined = False
