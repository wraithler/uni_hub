import django_filters

from apps.posts.models import Post


class PostFilter(django_filters.FilterSet):
    class Meta:
        model = Post
        fields = (
            "id",
            "content",
            "created_by",
            "community__name",
            "created_at",
            "community__memberships__user",
            "community__id",
            "pinned",
            "my"
        )

    my = django_filters.BooleanFilter(method="filter_my")

    def filter_my(self, queryset, name, value):
        if value:
            return queryset.filter(created_by=self.request.user)
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(PostFilter, self).filter_queryset(queryset)
        queryset = queryset.filter(community__memberships__user=self.request.user)
        return queryset