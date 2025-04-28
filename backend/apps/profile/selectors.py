from typing import Optional, Dict, Iterable

from apps.profile.filters import ProfileFilter
from apps.profile.models import Profile
from apps.users.models import BaseUser


def profile_get(*, user: BaseUser) -> Optional[Profile]:
    return Profile.objects.select_related("user").filter(user=user).first()


def profile_list(*, filters: Dict = None) -> Iterable[Profile]:
    filters = filters or {}

    qs = Profile.objects.select_related("user")

    return ProfileFilter(filters, qs).qs
