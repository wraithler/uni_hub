from django.db import transaction

from apps.common.services import model_update
from apps.communities.models import Community
from apps.events.models import Event
from apps.users.models import BaseUser


@transaction.atomic
def event_create(
    *,
    title: str,
    description: str,
    date: str,
    location: str,
    created_by: BaseUser,
    community: Community,
    is_virtual_event: bool,
    virtual_link: str,
):
    event = Event.objects.create(
        title=title,
        description=description,
        date=date,
        location=location,
        created_by=created_by,
        community=community,
        is_virtual_event=is_virtual_event,
        virtual_link=virtual_link,
    )

    return event


@transaction.atomic
def event_update(*, event: Event, data):
    non_side_effect_fields = []

    event, has_updated = model_update(
        instance=event, fields=non_side_effect_fields, data=data
    )

    return event
