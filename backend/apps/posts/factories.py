import factory

from apps.posts.models import Post
from apps.communities.factories import CommunityFactory
from apps.users.factories import BaseUserFactory


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    content = factory.Faker("paragraph", nb_sentences=5)
    community = factory.SubFactory(CommunityFactory)
    created_by = factory.SubFactory(BaseUserFactory)
