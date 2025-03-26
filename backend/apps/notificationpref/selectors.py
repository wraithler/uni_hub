from typing import Optional
from django.db.models import QuerySet
from apps.notificationpref.models import UserNotificationPreference

def notification_preference_get(user_id) -> Optional[UserNotificationPreference]:
    return UserNotificationPreference.objects.filter(user_id=user_id).first()

def notification_preference_list(*, filters=None) -> QuerySet[UserNotificationPreference]:
    filters = filters or {}
    qs = UserNotificationPreference.objects.all()
    if filters.get("user__username"):
        qs = qs.filter(user__username__icontains=filters["user__username"])
    return qs