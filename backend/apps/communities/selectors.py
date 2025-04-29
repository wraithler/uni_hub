from typing import Optional

from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.communities.filters import (
    CommunityFilter,
    CommunityCategoryFilter,
    CommunityInvitationFilter,
)
from apps.communities.models import (
    Community,
    CommunityTag,
    CommunityInvitation,
    CommunityCategory,
)


def community_get(community_id) -> Optional[Community]:
    community = get_object(Community, id=community_id)

    return community


def community_list(*, filters=None, request=None) -> QuerySet[Community]:
    filters = filters or {}

    qs = Community.objects.all()

    return CommunityFilter(filters, qs, request=request).qs


def community_category_get(community_category_id) -> Optional[CommunityTag]:
    community_category = get_object(CommunityCategory, id=community_category_id)

    return community_category


def community_category_list(*, filters=None) -> QuerySet[CommunityTag]:
    filters = filters or {}

    qs = CommunityCategory.objects.all()

    return CommunityCategoryFilter(filters, qs).qs


def community_invitation_get(community_invitation_id) -> Optional[CommunityInvitation]:
    community_invitation = get_object(CommunityInvitation, id=community_invitation_id)

    return community_invitation


def community_invitation_list(*, filters=None) -> QuerySet[CommunityInvitation]:
    filters = filters or {}

    qs = CommunityInvitation.objects.all()

    return CommunityInvitationFilter(filters, qs).qs
