import django_filters
from django.db.models import Q, Count
from apps.communities.models import Community, CommunityTag, CommunityInvitation


class CommunityFilter(django_filters.FilterSet):
    category_name = django_filters.CharFilter(
        field_name="category__name", lookup_expr="icontains"
    )
    my = django_filters.BooleanFilter(method="filter_my")
    name = django_filters.CharFilter(method="filter_name_or_tag")
    sort_by = django_filters.CharFilter(method="filter_sort_by")
    user_id = django_filters.CharFilter(method="filter_user_id")

    class Meta:
        model = Community
        fields = ("is_featured", "category_name", "name", "is_accepted", "is_declined")

    def filter_my(self, queryset, name, value):
        if value:
            return queryset.filter(memberships__user=self.request.user)
        return queryset

    def filter_name_or_tag(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(tags__name__icontains=value)
        ).distinct()

    def filter_sort_by(self, queryset, name, value):
        if value == "popular":
            return queryset.annotate(num_members=Count("memberships")).order_by(
                "-num_members"
            )

        if value == "new":
            return queryset.order_by("-created_at")

        if value == "alphabetical":
            return queryset.order_by("name")

        return queryset

    def filter_user_id(self, queryset, name, value):
        if value:
            return queryset.filter(memberships__user_id=value)
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(CommunityFilter, self).filter_queryset(queryset)

        queryset = queryset.filter(
            Q(privacy="public")
            | Q(privacy="restricted")
            | (Q(privacy="private") & Q(memberships__user=self.request.user))
        ).distinct()

        # Exclude communities that are not is_accepted from the queryset for non-admin users
        if not self.request.user.is_superuser:
            queryset = queryset.exclude(is_accepted=False, is_declined=True)

        return queryset


class CommunityCategoryFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityTag
        fields = (
            "id",
            "name",
        )


class CommunityInvitationFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityInvitation
        fields = ("id", "user", "community")
