from typing import List

from django.db import transaction
from apps.notification_preferences.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.common.services import model_update


@transaction.atomic
def notification_preference_create(
    *,
    user: BaseUser,
    event_updates: bool = True,
    post_notifications: bool = True,
    announcements: bool = True,
    email_notifications: bool = True,
    in_app_notifications: bool = True,
    subscribed_communities: list = None,
) -> UserNotificationPreference:
    pref = UserNotificationPreference.objects.create(
        user=user,
        event_updates=event_updates,
        post_notifications=post_notifications,
        announcements=announcements,
        email_notifications=email_notifications,
        in_app_notifications=in_app_notifications,
    )

    if subscribed_communities:
        pref.subscribed_communities.set(subscribed_communities)

    return pref


@transaction.atomic
def notification_preference_update(
    *, notification_preference: UserNotificationPreference, data
) -> UserNotificationPreference:
    non_side_effect_fields: List[str] = [
        "event_updates",
        "post_notifications",
        "announcements",
        "email_notifications",
        "in_app_notifications",
    ]

    user_notification_preference, has_updated = model_update(
        instance=notification_preference, fields=non_side_effect_fields, data=data
    )

    return user_notification_preference
