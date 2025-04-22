import factory.django

from apps.communities.factories import CommunityFactory
from apps.events.models import Event
from apps.users.factories import BaseUserFactory


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    title = factory.Faker("sentence", nb_words=4)
    description = factory.Faker("text")
    starts_at = factory.Faker("date_time")
    ends_at = factory.Faker("date_time")
    location = factory.Faker("address")
    created_by = factory.SubFactory(BaseUserFactory)
    community = factory.SubFactory(CommunityFactory)
    is_virtual_event = factory.Faker("boolean")
    virtual_link = factory.Faker("url")
