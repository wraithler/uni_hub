from typing import List

from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from apps.common.services import model_update
from apps.reactions.models import Comment, Like
from apps.posts.models import Post
from apps.core.exceptions import ApplicationError
from apps.users.models import BaseUser


@transaction.atomic
def comment_create(
    *,
    content: str,
    post_id: int,
    created_by: BaseUser,
) -> Comment:
    post = Post.objects.get(id=post_id)

    if not post.community.is_member(created_by):
        raise ApplicationError(
            "User must be a member of the community to create a comment"
        )

    comment = Comment.objects.create(
        content=content,
        post=post,
        created_by=created_by,
    )
    return comment


@transaction.atomic
def comment_update(*, comment: Comment, data) -> Comment:
    if not comment.created_by == data.get(
        "user", None
    ) and not comment.post.community.is_moderator(data.get("user", None)):
        raise ApplicationError(
            "Only the author or a community moderator can update this comment"
        )

    non_side_effect_fields: List[str] = ["content"]
    comment, has_updated = model_update(
        instance=comment, fields=non_side_effect_fields, data=data
    )
    return comment


@transaction.atomic
def comment_delete(*, comment: Comment, user: BaseUser) -> None:
    if (
        not comment.created_by == user
        and not comment.post.community.is_moderator(user)
        and not comment.post.community.is_admin(user)
    ):
        raise ApplicationError(
            "Only the author, a community moderator, or admin can delete this comment"
        )
    comment.delete()


@transaction.atomic
def like_create(*, obj: Comment | Post, user: BaseUser) -> Like:
    if isinstance(obj, Comment) and not obj.post.community.is_member(user):
        raise ApplicationError(
            "User must be a member of the community to like a comment"
        )

    content_type = ContentType.objects.get_for_model(obj.__class__)

    existing_like = Like.objects.filter(
        user=user, content_type=content_type, object_id=obj.id
    ).first()

    if not existing_like:
        existing_like = Like.objects.create(
            user=user, content_type=content_type, object_id=obj.id
        )

    return existing_like


@transaction.atomic
def like_delete(*, obj: Comment | Post, user: BaseUser) -> None:
    content_type = ContentType.objects.get_for_model(obj.__class__)

    like = Like.objects.filter(user=user, content_type=content_type, object_id=obj.id).first()

    if not like:
        raise ApplicationError("Like does not exist")

    like.delete()
