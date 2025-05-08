from typing import Optional, List

from django.db import transaction

from apps.common.services import model_update
from apps.emails.services import verification_email_create
from apps.notification_preferences.services import notification_preference_create
from apps.users.models import BaseUser


@transaction.atomic
def user_create(
    *,
    email: str,
    first_name: str,
    last_name: str,
    is_active: bool = True,
    password: Optional[str] = None,
    dob: Optional[str] = None,
    address: Optional[str] = None,
    post_code: Optional[str] = None,
    country: Optional[str] = None,
) -> BaseUser:
    user = BaseUser.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        is_active=is_active,
        password=password,
        dob=dob,
        address=address,
        post_code=post_code,
        country=country,
    )

    verification_email_create(user=user)
    notification_preference_create(user=user)

    return user


@transaction.atomic
def user_update(*, user: BaseUser, data) -> BaseUser:
    non_side_effect_fields: List[str] = [
        "first_name",
        "last_name",
        "is_email_verified",
        "bio",
        "academic_department",
        "contact_email",
        "contact_phone",
        "contact_detail_privacy",
        "dob",
        "address",
        "post_code",
        "country",
    ]

    user, has_updated = model_update(
        instance=user, fields=non_side_effect_fields, data=data
    )

    return user
