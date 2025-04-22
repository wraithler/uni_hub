from django.urls import path
from apps.notifications.apis import (
    NotificationListAPI,
    UnreadNotificationListAPI,
    MarkNotificationAsReadAPI,
    NotificationDetailAPI,
)

urlpatterns = [
    path(
        "",
        NotificationListAPI.as_view(),
        name="notification-list",
    ),
    path(
        "unread/",
        UnreadNotificationListAPI.as_view(),
        name="unread-notification-list",
    ),
    path(
        "<int:pk>/mark-read/",
        MarkNotificationAsReadAPI.as_view(),
        name="mark-notification-as-read",
    ),
    path(
        "<int:pk>/",
        NotificationDetailAPI.as_view(),
        name="notification-detail",
    ),
]