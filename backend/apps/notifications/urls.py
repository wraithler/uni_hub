from django.urls import path
from . import apis

app_name = "notifications"

urlpatterns = [
    path("", apis.NotificationListAPI.as_view(), name="notification-list"),
    path(
        "unread/",
        apis.NotificationUnreadListAPI.as_view(),
        name="notification-unread-list",
    ),
    path(
        "<int:pk>/mark-as-read/",
        apis.NotificationMarkAsReadAPI.as_view(),
        name="notification-mark-as-read",
    ),
    path(
        "mark-all-as-read/",
        apis.NotificationMarkAllAsReadAPI.as_view(),
        name="notification-mark-all-as-read",
    ),
    path("<int:pk>/", apis.NotificationDeleteAPI.as_view(), name="notification-delete"),
    path(
        "delete-all/",
        apis.NotificationDeleteAllAPI.as_view(),
        name="notification-delete-all",
    ),
    path("count/", apis.NotificationCountAPI.as_view(), name="notification-count"),
]
