from typing import Optional

from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.posts.filters import PostFilter
from apps.posts.models import Post


def post_get(post_id) -> Optional[Post]:
    post = get_object(Post, id=post_id)

    return post


def post_list(*, filters=None, request=None) -> QuerySet[Post]:
    filters = filters or {}
    qs = Post.objects.all()
    return PostFilter(filters, qs, request=request).qs

