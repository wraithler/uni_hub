import django_filters

from apps.communities.models import Community, CommunityCategory, CommunityInvitation


class CommunityFilter(django_filters.FilterSet):
    is_member = django_filters.BooleanFilter(method="filter_is_member")

    class Meta:
        model = Community
        fields = ("id", "name", "description", "is_private", "category__name")

    def filter_is_member(self, queryset, name, value):
        if value:
            return queryset.filter(memberships__user=self.request.user)

        return queryset


class CommunityCategoryFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityCategory
        fields = ("id", "name", "description")


class CommunityInvitationFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityInvitation
        fields = ("id", "user", "community")
