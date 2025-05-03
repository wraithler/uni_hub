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

    for field, choices in {
        "hobbies": Profile.HOBBY_CHOICES,
        "gender": Profile.GENDER_CHOICES,
        "course": Profile.COURSE_CHOICES,
        "pronouns": Profile.PRONOUN_CHOICES,
        "year_of_study": Profile.YEAR_CHOICES,
    }.items():
        if field in kwargs and kwargs[field] not in dict(choices):
            raise ValidationError(f"Invalid {field} selected")

    from datetime import date

    dob = kwargs.get("date_of_birth")
    if dob:
        today = date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        if age < 18:
            raise ValidationError("You must be at least 18 years old to create an Account")

    return Profile.objects.create(user=user, **kwargs)


@transaction.atomic
def profile_update(*, profile: Profile, data: Dict[str, Any]) -> Profile:
    non_side_effect_fields = [
        "gender",
        "pronouns",
        "year_of_study",
        "hobbies",
        "course",
        "phone_number",
        "date_of_birth",
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
        "pronouns": {"value": profile.pronouns, "display": profile.get_pronouns_display()},
        "year_of_study": {"value": profile.year_of_study, "display": profile.get_year_of_study_display()},
        "hobbies": {"value": profile.hobbies, "display": profile.get_hobbies_display()},
        "course": {"value": profile.course, "display": profile.get_course_display()},
        "phone_number": profile.phone_number,
        "date_of_birth": profile.date_of_birth,
        "github_url": profile.github_url,
        "linkedin_url": profile.linkedin_url,
    }
