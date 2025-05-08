from typing import Optional

from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.events.filters import EventFilter
from apps.events.models import Event


def event_get(event_id) -> Optional[Event]:
    event = get_object(Event, id=event_id)

    return event


def event_list(*, filters=None, request) -> QuerySet[Event]:
    filters = filters or {}

    qs = Event.objects.all()

    return EventFilter(filters, qs, request=request).qs
