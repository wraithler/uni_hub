from typing import Optional, List

from apps.common.utils import get_object
from apps.communities.models import Community
from apps.users.filters import BaseUserFilter
from apps.users.models import BaseUser


def users_share_community(user1, user2):
    return (
        Community.objects.filter(memberships__user=user1)
        .filter(memberships__user=user2)
        .exists()
    )


def _strip_contact_info(user: BaseUser):
    user.contact_email = None
    user.contact_phone = None
    return user


def strip_contact_info(user: BaseUser, request):
    if user.contact_detail_privacy == "MEMBERS":
        if users_share_community(user, request.user):
            return user
        else:
            return _strip_contact_info(user)

    if user.contact_detail_privacy == "PRIVATE":
        return _strip_contact_info(user)


def strip_other_details(user: BaseUser):
    user.dob = None
    user.address = None
    user.post_code = None
    user.country = None
    return user


def user_get(user_id, request=None) -> Optional[BaseUser]:
    user: BaseUser = get_object(BaseUser, id=user_id)

    return user


def user_list(*, filters=None, request=None) -> List[BaseUser | None]:
    filters = filters or {}

    qs = BaseUser.objects.all()

    return BaseUserFilter(filters, qs, request=request).qs
