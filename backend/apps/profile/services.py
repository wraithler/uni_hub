from typing import Dict, Any
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Profile
from apps.communities.models import Community
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
        "year_of_study": Profile.YEAR_CHOICES,
    }.items():
        if field in kwargs and kwargs[field] not in dict(choices):
            raise ValidationError(f"Invalid {field} selected")
        
    return Profile.objects.create(user=user, **kwargs)

@transaction.atomic
def profile_update(*, user: BaseUser, profile: Profile, data: Dict[str, Any]) -> Profile:
    if profile.user != user:
        raise ValidationError("You do not have permission to update this profile")

    non_side_effect_fields = [
        "gender",
        "year_of_study",
        "hobbies",
        "course",
        "phone_number",
        "student_number",
        "github_url",
        "linkedin_url",
    ]

    phone = data.get("phone_number")
    if phone and not phone.isdigit():
        raise ValidationError("Phone number must contain only digits")

    student = data.get("student_number")
    if student and not student.isdigit():
        raise ValidationError("Student number must contain only digits")

    profile, has_updated = model_update(
        instance=profile, fields=non_side_effect_fields, data=data
    )

    return profile


def model_update(*, instance, fields, data):
    has_updated = False

    for field in fields:
        if field in data:
            old_value = getattr(instance, field)
            new_value = data[field]

            if old_value != new_value:
                setattr(instance, field, new_value)
                has_updated = True

    if has_updated:
        instance.full_clean()  
        instance.save()

    return instance, has_updated


def profile_display(profile: Profile, viewer) -> Dict[str, Any]:
    owner = profile.user == viewer
    shared = owner or Community.objects.filter(
        memberships__user=profile.user
    ).filter(
        memberships__user=viewer
    ).exists()
    phone = profile.phone_number if owner or shared else None
    email = profile.user.email if owner or shared else None
    student_number = profile.student_number if owner else None
    return {
        "id": profile.id,
        "first_name": profile.user.first_name,
        "last_name": profile.user.last_name,
        "email": email,
        "year_of_study": {"value": profile.year_of_study, "display": profile.get_year_of_study_display()},
        "hobbies": {"value": Profile.HOBBY_CHOICES, "display": profile.get_hobbies_display()},
        "course": {"value": profile.course, "display": profile.get_course_display()},
        "phone_number": phone,
        "github_url": profile.github_url,
        "linkedin_url": profile.linkedin_url if owner or shared else None,
        "student_number": student_number,
    }
