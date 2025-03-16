import factory.fuzzy
from faker import Faker

from api.models import Post, User, Community, CommunityCategory, PostLike, Comment, Event, Friend

fake = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.LazyAttribute(lambda _: fake.unique.user_name())
    email = factory.LazyAttribute(lambda _: fake.unique.email())
    name = factory.Faker("name")
    password = factory.Faker("password")
    profile_picture = factory.Faker("image_url")


class CommunityCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityCategory

    name = factory.Faker("sentence", nb_words=3)
    description = factory.Faker("text")


class CommunityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Community

    name = factory.Faker("sentence", nb_words=3)
    description = factory.Faker("text")
    category = factory.SubFactory(CommunityCategoryFactory)
    created_by = factory.SubFactory(UserFactory)


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    title = factory.Faker("sentence", nb_words=4)
    content = factory.Faker("text")
    created_by = factory.SubFactory(UserFactory)
    community = factory.SubFactory(CommunityFactory)


class PostLikeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PostLike

    user = factory.SubFactory(UserFactory)
    post = factory.SubFactory(PostFactory)


class PostCommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    content = factory.Faker("text")
    created_by = factory.SubFactory(UserFactory)
    post = factory.SubFactory(PostFactory)


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    title = factory.Faker("sentence", nb_words=4)
    description = factory.Faker("text")
    event_date = factory.Faker("date_time")
    location = factory.Faker("address")
    created_by = factory.SubFactory(UserFactory)
    community = factory.SubFactory(CommunityFactory)
    virtual_event = factory.Faker("boolean")
    virtual_link = factory.LazyAttribute(lambda o: factory.Faker("url") if o.virtual_event else None)


class FriendFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Friend

    user1 = factory.SubFactory(UserFactory)
    user2 = factory.SubFactory(UserFactory)