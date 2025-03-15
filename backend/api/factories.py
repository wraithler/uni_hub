import factory.fuzzy

from api.models import Post, User, Community, CommunityCategory, PostLike, Comment


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    name = factory.Faker("name")
    password = factory.Faker("password")


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