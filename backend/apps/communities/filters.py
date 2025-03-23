import django_filters
from django.db.models import Count

from apps.communities.models import Community, CommunityCategory, CommunityInvitation


class CommunityFilter(django_filters.FilterSet):
    VISIBILITY_CHOICES = (
        ("all", "All"),
        ("public", "Public"),
        ("private", "Private"),
    )

    MEMBERSHIP_CHOICES = (
        ("all", "All"),
        ("member", "Member"),
        ("not_member", "Not Member"),
    )

    visibility = django_filters.ChoiceFilter(
        choices=VISIBILITY_CHOICES,
        method="filter_visibility",
        empty_label=None,
        initial="all",
    )

    membership_status = django_filters.ChoiceFilter(
        choices=MEMBERSHIP_CHOICES,
        method="filter_membership_status",
        empty_label=None,
        initial="all",
    )

    sort_by = django_filters.OrderingFilter(
        fields=(
            ("name", "name"),
            ("created_at", "created_at"),
            ("updated_at", "updated_at"),
            ("member_count", "popularity"),
        ),
        field_labels={
            "name": "Name",
            "created_at": "Creation Date",
            "updated_at": "Last Updated",
            "member_count": "Popularity",
        },
    )

    class Meta:
        model = Community
        fields = ("id", "name", "description")

    def filter_queryset(self, queryset):
        queryset = queryset.annotate(member_count=Count("memberships"))
        return super().filter_queryset(queryset)

    def filter_visibility(self, queryset, name, value):
        if value == "public":
            return queryset.filter(is_private=False)
        elif value == "private":
            return queryset.filter(is_private=True)
        return queryset

    def filter_membership_status(self, queryset, name, value):
        user = getattr(self.request, "user", None)
        if not user or not user.is_authenticated:
            return queryset.none() if value == "member" else queryset

        if value == "member":
            return queryset.filter(memberships__user=user)
        elif value == "not_member":
            return queryset.exclude(memberships__user=user)
        return queryset


class CommunityCategoryFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityCategory
        fields = ("id", "name", "description")


class CommunityInvitationFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityInvitation
        fields = ("id", "user", "community")
