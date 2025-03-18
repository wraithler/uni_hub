import factory

from apps.communities.models import CommunityCategory, Community
from apps.users.factories import BaseUserFactory


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
    created_by = factory.SubFactory(BaseUserFactory)
