import django_filters
from django.utils import timezone

from apps.events.models import Event


class EventFilter(django_filters.FilterSet):
    past = django_filters.BooleanFilter(method="filter_past")
    upcoming = django_filters.BooleanFilter(method="filter_upcoming")

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

    def filter_past(self, queryset, name, value):
        if value:
            return queryset.filter(ends_at__lte=timezone.now())
        return queryset

    def filter_upcoming(self, queryset, name, value):
        if value:
            return queryset.filter(starts_at__gt=timezone.now())
        return queryset