from typing import Optional

from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.posts.filters import PostFilter
from apps.posts.models import Post


def post_get(post_id) -> Optional[Post]:
    post = get_object(Post, id=post_id)
    return post


def post_list(*, filters=None) -> QuerySet[Post]:
    filters = filters or {}
    qs = Post.objects.all()
    return PostFilter(filters, qs).qs


def post_list_by_community(*, community_id, filters=None) -> QuerySet[Post]:
    filters = filters or {}
    qs = Post.objects.filter(community_id=community_id)
    return PostFilter(filters, qs).qs


def post_list_by_user(*, user_id, filters=None) -> QuerySet[Post]:
    filters = filters or {}
    qs = Post.objects.filter(created_by_id=user_id)
    return PostFilter(filters, qs).qs
