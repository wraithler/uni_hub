from typing import List

from django.db import transaction

from apps.common.services import model_update
from apps.communities.models import CommunityCategory, Community, CommunityInvitation
from apps.core.exceptions import ApplicationError
from apps.users.models import BaseUser


@transaction.atomic
def community_category_create(*, name: str, description: str) -> CommunityCategory:
    category = CommunityCategory.objects.create(name=name, description=description)

    return category


@transaction.atomic
def community_category_update(
    *, community_category: CommunityCategory, data
) -> CommunityCategory:
    non_side_effect_fields: List[str] = ["name", "description"]

    community_category, has_updated = model_update(
        instance=community_category, fields=non_side_effect_fields, data=data
    )

    return community_category


@transaction.atomic
def community_create(
    *,
    name: str,
    description: str,
    category: CommunityCategory,
    created_by: BaseUser,
    emoji: str = None,
) -> Community:
    community = Community.objects.create(
        name=name,
        description=description,
        category=category,
        created_by=created_by,
        emoji=emoji,
    )

    community.memberships.create(user=created_by)

    return community


@transaction.atomic
def community_update(*, community: Community, data) -> Community:
    non_side_effect_fields: List[str] = ["name", "description", "emoji"]

    community, has_updated = model_update(
        instance=community, fields=non_side_effect_fields, data=data
    )

    return community


@transaction.atomic
def community_join(*, community: Community, user: BaseUser) -> Community:
    if community.is_member(user):
        raise ApplicationError("User is already a member of this community")

    if community.is_private:
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
def community_invitation_create(*, community: Community, user: BaseUser) -> CommunityInvitation:
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
