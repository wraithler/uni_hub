from django.urls import path
from apps.notification_preferences.apis import (
    UserNotificationPreferenceDetailAPI,
    UserNotificationPreferenceUpdateAPI,
)

urlpatterns = [
    path(
        "notification-preferences/",
        UserNotificationPreferenceDetailAPI.as_view(),
        name="notification-preferences-retrieve",
    ),
    path(
        "notification-preferences/update/",
        UserNotificationPreferenceUpdateAPI.as_view(),
        name="notification-preferences-update",
    ),
]
