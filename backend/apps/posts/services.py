from typing import List
from django.db import transaction
from apps.common.services import model_update
from apps.posts.models import Post
from apps.communities.models import Community
from apps.core.exceptions import ApplicationError
from apps.users.models import BaseUser


@transaction.atomic
def post_create(
    *,
    title: str,
    content: str,
    community_id: int,
    created_by: BaseUser,
) -> Post:
    community = Community.objects.get(id=community_id)

    if not community.is_member(created_by):
        raise ApplicationError(
            "User must be a member of the community to create a post"
        )

    post = Post.objects.create(
        title=title,
        content=content,
        community=community,
        created_by=created_by,
    )

    return post


@transaction.atomic
def post_update(*, post: Post, data) -> Post:
    if not post.created_by == data.get(
        "user", None
    ) and not post.community.is_moderator(data.get("user", None)):
        raise ApplicationError(
            "Only the author or a community moderator can update this post"
        )

    non_side_effect_fields: List[str] = ["title", "content"]
    post, has_updated = model_update(
        instance=post, fields=non_side_effect_fields, data=data
    )

    return post


@transaction.atomic
def post_delete(*, post: Post, user: BaseUser) -> None:
    if (
        not post.created_by == user
        and not post.community.is_moderator(user)
        and not post.community.is_admin(user)
    ):
        raise ApplicationError(
            "Only the author, a community moderator, or admin can delete this post"
        )

    post.delete()
