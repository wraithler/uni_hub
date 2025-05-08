import django_filters
from django.db.models import Value, CharField, Q
from django.db.models.functions import Concat, Lower, Trim

from apps.users.models import BaseUser


class BaseUserFilter(django_filters.FilterSet):
    class Meta:
        model = BaseUser
        fields = ("id", "email", "community_id", "name", "is_staff")

    community_id = django_filters.NumberFilter(field_name="memberships__community_id")
    name = django_filters.CharFilter(method="filter_name", lookup_expr="icontains")
    is_staff = django_filters.BooleanFilter(method="filter_is_staff")

    def filter_name(self, queryset, name, value):
        if value:
            full_name = Concat(
                "first_name", Value(" "), "last_name", output_field=CharField()
            )
            return queryset.annotate(full_name=Lower(Trim(full_name))).filter(
                full_name__icontains=value.lower().strip()
            )
        return queryset

    def filter_is_staff(self, queryset, name, value):
        if value is True:
            return queryset.filter(
                Q(memberships__is_moderator=True) | Q(memberships__is_admin=True)
            )
        return queryset