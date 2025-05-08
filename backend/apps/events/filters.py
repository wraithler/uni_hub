import django_filters
from django.db.models import Q
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

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        # Filter by community privacy
        queryset = queryset.filter(
            Q(community__privacy="public") |
            Q(community__memberships__user=self.request.user)
        )

        # Filter by event privacy
        queryset = queryset.filter(
            Q(privacy="public") |
            Q(privacy="members", community__memberships__user=self.request.user)
        )

        return queryset

