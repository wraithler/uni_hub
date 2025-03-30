from django.db.models import QuerySet
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser 


def get_user_notification_preference(*, user: BaseUser) -> UserNotificationPreference:

    try:
        return UserNotificationPreference.objects.get(user=user)
    except UserNotificationPreference.DoesNotExist:
        raise Exception(
            "Notification preferences should be created via user service. "
            f"No preferences found for user {user.id}"
        )

def list_all_notification_preferences() -> QuerySet[UserNotificationPreference]:
    return UserNotificationPreference.objects.all()