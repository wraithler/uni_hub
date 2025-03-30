from typing import Optional, List

from django.db import transaction

from apps.common.services import model_update
from apps.emails.services import confirmation_email_create
from apps.users.models import BaseUser
from apps.notificationpref.models import UserNotificationPreference


@transaction.atomic
def user_create(
    *,
    email: str,
    first_name: str,
    last_name: str,
    is_active: bool = True,
    is_admin: bool = False,
    password: Optional[str] = None,
) -> BaseUser:
    user = BaseUser.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        is_active=is_active,
        is_admin=is_admin,
        password=password,
    )

    UserNotificationPreference.objects.create(
        user=user,
        event_updates=True,
        post_notifications=True,
        announcements=True,
        email_notifications=True,
        in_app_notifications=True
    )

    confirmation_email_create(user=user)

    return user


@transaction.atomic
def user_update(*, user: BaseUser, data) -> BaseUser:
    non_side_effect_fields: List[str] = ["first_name", "last_name"]

    user, has_updated = model_update(
        instance=user, fields=non_side_effect_fields, data=data
    )

    return user
