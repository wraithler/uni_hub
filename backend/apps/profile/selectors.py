from typing import Optional, Dict, Iterable
from django.core.exceptions import ObjectDoesNotExist
from apps.profile.models import Profile

def get_profile_by_user(user) -> Optional[Profile]:
    try:
        return Profile.objects.select_related("user").get(user=user)
    except ObjectDoesNotExist:
        return None

def get_profiles(*, filters: Dict = None) -> Iterable[Profile]:

    qs = Profile.objects.select_related("user")
    return qs.filter(**filters) if filters else qs

