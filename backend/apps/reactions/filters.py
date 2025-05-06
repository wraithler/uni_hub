import django_filters
from apps.reactions.models import Comment


class CommentFilter(django_filters.FilterSet):
    class Meta:
        model = Comment
        fields = (
            "id",
            "content",
            "created_by",
            "post__community__name",
            "created_at",
        )
