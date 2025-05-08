import factory.django
from faker import Faker

from apps.friends.models import FriendRequest, Friend
from apps.users.models import BaseUser

fake = Faker()


class FriendRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FriendRequest

    sender = factory.SubFactory("apps.users.factories.BaseUserFactory")
    receiver = factory.SubFactory("apps.users.factories.BaseUserFactory")
    is_accepted = False
    is_declined = False


class FriendFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Friend

    user = factory.SubFactory("apps.users.factories.BaseUserFactory")
    friend = factory.SubFactory("apps.users.factories.BaseUserFactory")
