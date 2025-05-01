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
        )
