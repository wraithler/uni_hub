from typing import Dict, Any
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Profile
from apps.users.models import BaseUser
from apps.common.services import model_update


@transaction.atomic
def profile_create(user, **kwargs):
    if Profile.objects.filter(user=user).exists():
        raise ValidationError("User already has a profile")

    if "hobbies" in kwargs and kwargs["hobbies"] not in dict(Profile.HOBBY_CHOICES):
        raise ValidationError("Invalid hobby selected")

    return Profile.objects.create(user=user, **kwargs)


@transaction.atomic
def profile_update(*, profile: Profile, data: Dict[str, Any]) -> Profile:
    non_side_effect_fields = [
        "gender",
        "hobbies",
        "bio",
        "website_url",
        "github_url",
        "linkedin_url",
    ]

    profile, has_updated = model_update(
        instance=profile, fields=non_side_effect_fields, data=data
    )

    return profile


def get_profile_display_data(profile: Profile) -> Dict[str, Any]:
    return {
        "gender": {"value": profile.gender, "display": profile.get_gender_display()},
        "hobbies": {"value": profile.hobbies, "display": profile.get_hobbies_display()},
        "bio": profile.bio,
        "website_url": profile.website_url,
        "github_url": profile.github_url,
        "linkedin_url": profile.linkedin_url,
    }
