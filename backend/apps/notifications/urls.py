from django.urls import path
from apps.notifications.apis import (
    NotificationListAPI,
    UnreadNotificationListAPI,
    MarkNotificationAsReadAPI,
    NotificationDetailAPI,
)

urlpatterns = [
    path(
        "notifications/",
        NotificationListAPI.as_view(),
        name="notification-list",
    ),
    path(
        "notifications/unread/",
        UnreadNotificationListAPI.as_view(),
        name="unread-notification-list",
    ),
    path(
        "notifications/<int:pk>/mark-read/",
        MarkNotificationAsReadAPI.as_view(),
        name="mark-notification-as-read",
    ),
    path(
        "notifications/<int:pk>/",
        NotificationDetailAPI.as_view(),
        name="notification-detail",
    ),
]