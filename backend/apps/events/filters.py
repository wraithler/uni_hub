import django_filters

from apps.events.models import Event


class EventFilter(django_filters.FilterSet):
    class Meta:
        model = Event
        fields = (
            "id",
            "title",
            "description",
            "starts_at",
            "ends_at",
            "location",
            "created_by",
            "community",
            "is_virtual_event",
            "virtual_link",
            "community__memberships__user",
        )
