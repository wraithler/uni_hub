from typing import Optional
from django.db.models import QuerySet
from apps.common.utils import get_object
from apps.comments.filters import CommentFilter
from apps.comments.models import Comment


def comment_get(comment_id) -> Optional[Comment]:
    comment = get_object(Comment, id=comment_id)
    return comment


def comment_list(*, filters=None) -> QuerySet[Comment]:
    filters = filters or {}
    qs = Comment.objects.all()
    return CommentFilter(filters, qs).qs


def comment_list_by_post(*, post_id, filters=None) -> QuerySet[Comment]:
    filters = filters or {}
    qs = Comment.objects.filter(post_id=post_id)
    return CommentFilter(filters, qs).qs


def comment_list_by_user(*, user_id, filters=None) -> QuerySet[Comment]:
    filters = filters or {}
    qs = Comment.objects.filter(created_by_id=user_id)
    return CommentFilter(filters, qs).qs
