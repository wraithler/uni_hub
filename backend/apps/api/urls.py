from django.urls import path, include

urlpatterns = [
    path("auth/", include(("apps.authentication.urls", "authentication"))),
    path("users/", include(("apps.users.urls", "users"))),
    path("communities/", include(("apps.communities.urls", "communities"))),
    path("events/", include(("apps.events.urls", "events"))),
    path("friends/", include(("apps.friends.urls", "friends"))),
    path(
        "notification/",
        include(("apps.notification_preferences.urls", "notification_preferences")),
    ),
    path("notifications/", include(("apps.notifications.urls", "notifications"))),
    path("posts/", include(("apps.posts.urls", "posts"))),
    path("files/", include(("apps.files.urls", "files"))),
    path("reactions/", include(("apps.reactions.urls", "reactions"))),
]
