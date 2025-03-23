import factory
from faker import Faker

from apps.communities.models import CommunityCategory, Community, CommunityInvitation
from apps.users.factories import BaseUserFactory

fake = Faker()

class CommunityCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityCategory

    name = factory.Sequence(lambda n: f"{fake.sentence(nb_words=3)[:20]} {n}")
    description = factory.Faker("text")


class CommunityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Community

    name = factory.Sequence(lambda n: f"{fake.sentence(nb_words=3)[:20]} {n}")
    description = factory.Faker("text")
    category = factory.SubFactory(CommunityCategoryFactory)
    created_by = factory.SubFactory(BaseUserFactory)
    emoji = factory.Faker("emoji")
    is_private = factory.Faker("boolean")

    @factory.post_generation
    def add_membership(self, create, extracted, **kwargs):
        if create:
            self.memberships.create(user=self.created_by)  # noqa


class CommunityInvitationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommunityInvitation

    community = factory.SubFactory(CommunityFactory)
    user = factory.SubFactory(BaseUserFactory)
