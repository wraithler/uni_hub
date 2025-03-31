import factory
from faker import Faker

from apps.communities.models import (
    CommunityTag,
    Community,
    CommunityInvitation,
    CommunityCategory,
)
from apps.users.factories import BaseUserFactory

fake = Faker()


class CommunityCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityCategory

    name = factory.Sequence(lambda n: f"{fake.sentence(nb_words=3)[:20]} {n}")


class CommunityTagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityTag

    name = factory.Sequence(lambda n: f"{fake.sentence(nb_words=3)[:20]} {n}")


class CommunityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Community

    name = factory.Sequence(lambda n: f"{fake.sentence(nb_words=3)[:20]} {n}")
    description = factory.Faker("text")
    created_by = factory.SubFactory(BaseUserFactory)
    emoji = factory.Faker("emoji")
    is_private = factory.Faker("boolean")
    category = factory.SubFactory(CommunityCategoryFactory)

    @factory.post_generation
    def add_membership(self, create, extracted, **kwargs):
        if create:
            self.memberships.create(user=self.created_by)  # noqa

    @factory.post_generation
    def add_tags(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            self.tags.set(extracted)  # noqa
        else:
            self.tags.set([CommunityTagFactory.create()])  # noqa


class CommunityInvitationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityInvitation

    community = factory.SubFactory(CommunityFactory)
    user = factory.SubFactory(BaseUserFactory)
