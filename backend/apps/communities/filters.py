import django_filters

from apps.communities.models import Community, CommunityTag, CommunityInvitation


class CommunityFilter(django_filters.FilterSet):
    category_name = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')

    class Meta:
        model = Community
        fields = ("is_featured", "category_name")


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
