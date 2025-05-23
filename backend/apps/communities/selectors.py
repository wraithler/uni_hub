from datetime import timedelta
from typing import Optional

from django.db.models import QuerySet, Q

from apps.common.services import calculate_growth, counts_by_delta
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
    CommunityJoinRequest,
)
from apps.users.models import BaseUser


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


def community_dashboard_get(*, community_id):
    community = community_get(community_id)

    total_members = community.memberships.count()
    pending_requests = community.join_requests.filter(
        (Q(is_accepted=False) & Q(is_rejected=False))
    )
    total_posts = community.posts.count()
    total_events = community.events.count()
    upcoming_events = community.events.all()[:3]
    admins = BaseUser.objects.filter(
        memberships__community=community, memberships__is_admin=True
    )
    moderators = BaseUser.objects.filter(
        memberships__community=community, memberships__is_moderator=True
    )

    member_growth = calculate_growth(community, "memberships", timedelta(days=30), 12)
    engagement = counts_by_delta(community, ["posts", "events"])

    return {
        "total_members": total_members,
        "pending_requests": pending_requests,
        "total_posts": total_posts,
        "total_events": total_events,
        "member_growth": member_growth,
        "engagement": engagement,
        "upcoming_events": upcoming_events,
        "admins": admins,
        "moderators": moderators,
    }


def community_join_request_get(*, join_request_id) -> CommunityJoinRequest:
    join_request = get_object(CommunityJoinRequest, id=join_request_id)

    return join_request
