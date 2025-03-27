from typing import List
from django.db import transaction
from apps.common.services import model_update
from apps.comments.models import Comment, Like, PostLike
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
def comment_like_create(*, comment: Comment, user: BaseUser) -> Like:
    if not comment.post.community.is_member(user):
        raise ApplicationError(
            "User must be a member of the community to like a comment"
        )
    
    existing_like, created = Like.objects.get_or_create(
        comment=comment, 
        user=user
    )
    
    return existing_like


@transaction.atomic
def comment_like_delete(*, comment: Comment, user: BaseUser) -> None:
    Like.objects.filter(
        comment=comment, 
        user=user
    ).delete()


@transaction.atomic
def post_like_create(*, post: Post, user: BaseUser) -> PostLike:
    if not post.community.is_member(user):
        raise ApplicationError(
            "User must be a member of the community to like a post"
        )

    existing_like, created = PostLike.objects.get_or_create(
        post=post, 
        user=user
    )
    
    return existing_like


@transaction.atomic
def post_like_delete(*, post: Post, user: BaseUser) -> None:
    PostLike.objects.filter(
        post=post, 
        user=user
    ).delete()