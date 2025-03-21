import factory

from apps.communities.models import CommunityCategory, Community, CommunityInvitation
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
    emoji = factory.Faker("emoji")

    @factory.post_generation
    def add_membership(self, create, extracted, **kwargs):
        if create:
            self.memberships.create(user=self.created_by)  # noqa


class CommunityInvitationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityInvitation

    community = factory.SubFactory(CommunityFactory)
    user = factory.SubFactory(BaseUserFactory)
