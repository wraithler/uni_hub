from typing import Optional, Dict, Iterable
from django.core.exceptions import ObjectDoesNotExist
from apps.profile.models import Profile
from rest_framework.exceptions import NotFound

def profile_by_user_get(user) -> Optional[Profile]:
    try:
        return Profile.objects.select_related("user").get(user=user)
    except ObjectDoesNotExist:
        raise NotFound("Profile not found for the given user.")

def profiles_get(*, filters: Dict = None) -> Iterable[Profile]:

    qs = Profile.objects.select_related("user")
    return qs.filter(**filters) if filters else qs

