from django.db.models import QuerySet
from apps.notification_preferences.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.common.utils import get_object


def user_notification_preference_get(*, user: BaseUser) -> UserNotificationPreference:
    return get_object(UserNotificationPreference, user=user)


def list_all_notification_preferences() -> QuerySet[UserNotificationPreference]:
    return UserNotificationPreference.objects.all()
