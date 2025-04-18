from django.urls import path
from apps.notifications.apis import (
    UserNotificationPreferenceDetailAPI,
    UserNotificationPreferenceUpdateAPI,
)

urlpatterns = [
    path(
        "notifications/preferences/",
        UserNotificationPreferenceDetailAPI.as_view(),
        name="notification-preferences-retrieve",
    ),
    path(
        "notifications/preferences/update/",
        UserNotificationPreferenceUpdateAPI.as_view(),
        name="notification-preferences-update",
    ),
]