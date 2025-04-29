from typing import List

from django.db import transaction

from apps.common.services import model_update
from apps.communities.models import CommunityTag, Community, CommunityInvitation, CommunityCategory, CommunityGuidelines
from apps.communities.selectors import community_category_list
from apps.core.exceptions import ApplicationError
from apps.files.models import File
from apps.users.models import BaseUser


@transaction.atomic
def community_create_new(
    *,
    name: str,
    description: str,
    tags: List[CommunityTag],
    category: CommunityCategory,
    created_by: BaseUser,
    about: str,
    guidelines: List[CommunityGuidelines],
    avatar: File,
    banner: File,
    contact_email: str,
) -> Community:
    community = Community.objects.create(
        name=name,
        description=description,
        created_by=created_by,
        category=category,
        about=about,
        avatar=avatar,
        banner=banner,
        contact_email=contact_email,
    )
    community.tags.add(*tags)
    community.guidelines.add(*guidelines)
    community.memberships.create(user=created_by)

    return community


@transaction.atomic
def community_category_create(*, name: str) -> CommunityCategory:
    category = CommunityCategory.objects.create(name=name)

    return category


@transaction.atomic
def community_category_update(
    *, community_category: CommunityCategory, data
) -> CommunityCategory:
    non_side_effect_fields: List[str] = ["name"]

    community_category, has_updated = model_update(
        instance=community_category, fields=non_side_effect_fields, data=data
    )

    return community_category

def get_or_create_tags(tag_names: List[str]) -> List[CommunityTag]:
    tags = []

    for tag_name in tag_names:
        tag, _ = CommunityTag.objects.get_or_create(name=tag_name)
        tags.append(tag)

    return tags

@transaction.atomic
def community_create(
    *,
    name: str,
    description: str,
    tags: List[CommunityTag | str],
    created_by: BaseUser,
    category: CommunityCategory | str,
    **kwargs
) -> Community:
    if isinstance(tags[0], str):
        tags = get_or_create_tags(tags)

    if isinstance(category, str):
        category = community_category_list(filters={"name": category}).first()

    community = Community.objects.create(
        name=name, description=description, created_by=created_by, category=category, **kwargs
    )
    community.tags.add(*tags)
    community.memberships.create(user=created_by)

    return community


@transaction.atomic
def community_update(*, community: Community, data) -> Community:
    non_side_effect_fields: List[str] = ["name", "description", "is_featured"]

    community, has_updated = model_update(
        instance=community, fields=non_side_effect_fields, data=data
    )

    return community


@transaction.atomic
def community_join(*, community: Community, user: BaseUser) -> Community:
    if community.is_member(user):
        raise ApplicationError("User is already a member of this community")

    if community.privacy == "private":
        invitation = community.invitations.filter(user=user).first()

        if invitation:
            community_invitation_update(
                invitation=invitation, data={"is_accepted": True}
            )
        else:
            raise ApplicationError("User is not invited to this community")

    community.memberships.create(user=user)

    return community


@transaction.atomic
def community_invitation_create(
    *, community: Community, user: BaseUser
) -> CommunityInvitation:
    invitation = CommunityInvitation.objects.create(community=community, user=user)

    return invitation


@transaction.atomic
def community_invitation_update(
    *, invitation: CommunityInvitation, data
) -> CommunityInvitation:
    non_side_effect_fields: List[str] = ["is_accepted"]

    invitation, has_updated = model_update(
        instance=invitation, fields=non_side_effect_fields, data=data
    )

    return invitation


@transaction.atomic
def community_tag_create(*, name: str) -> CommunityTag:
    tag = CommunityTag.objects.create(name=name)

    return tag
