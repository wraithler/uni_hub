import django_filters

from apps.communities.models import Community, CommunityCategory


class CommunityFilter(django_filters.FilterSet):
    class Meta:
        model = Community
        fields = ("id", "name", "description")


class CommunityCategoryFilter(django_filters.FilterSet):
    class Meta:
        model = CommunityCategory
        fields = ("id", "name", "description")