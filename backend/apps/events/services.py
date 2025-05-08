from datetime import datetime

from django.db import transaction

from apps.common.services import model_update
from apps.communities.models import Community
from apps.communities.selectors import community_get
from apps.core.exceptions import ApplicationError
from apps.events.models import Event, EventTicket
from apps.users.models import BaseUser


@transaction.atomic
def event_create(
    *,
    title: str,
    description: str,
    starts_at: datetime,
    ends_at: datetime,
    location: str,
    created_by: BaseUser,
    community: Community | int,
    is_virtual_event: bool,
    virtual_link: str,
    privacy: str,
):
    if isinstance(community, int):
        community = community_get(community_id=community)

    if not community.is_member(created_by):
        raise ApplicationError("User is not a member of the community")

    if not community.is_moderator(created_by) and not community.is_admin(created_by):
        raise ApplicationError("User is not a moderator or admin of the community")

    event = Event.objects.create(
        title=title,
        description=description,
        starts_at=starts_at,
        ends_at=ends_at,
        location=location,
        created_by=created_by,
        community=community,
        is_virtual_event=is_virtual_event,
        virtual_link=virtual_link,
        privacy=privacy,
    )

    return event


@transaction.atomic
def event_update(*, event: Event, data):
    non_side_effect_fields = []

    event, has_updated = model_update(
        instance=event, fields=non_side_effect_fields, data=data
    )

    return event


@transaction.atomic
def event_ticket_create(*, event: Event, user: BaseUser) -> EventTicket:
    ticket, created = EventTicket.objects.get_or_create(event=event, user=user)

    if not ticket.qr_code:
        ticket.generate_qr_code()
        ticket.save()

    return ticket


@transaction.atomic
def event_ticket_update(*, ticket: EventTicket, used: bool) -> EventTicket:
    ticket.used = used
    ticket.save()
    return ticket
