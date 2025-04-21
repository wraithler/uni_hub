from django.urls import path, include

urlpatterns = [
    path("auth/", include(("apps.authentication.urls", "authentication"))),
    path("users/", include(("apps.users.urls", "users"))),
    path("communities/", include(("apps.communities.urls", "communities"))),
    path("events/", include(("apps.events.urls", "events"))),
    path("feed/", include(("apps.feed.urls", "feed"))),
    path("friends/", include(("apps.friends.urls", "friends"))),
    path("notification/", include(("apps.notification_preferences.urls", "notification_preferences"))),
    path("profile/", include(("apps.profile.urls", "profile"))),
    path("posts/", include(("apps.posts.urls", "posts"))),
    path("files/", include(("apps.files.urls", "files"))),
]
