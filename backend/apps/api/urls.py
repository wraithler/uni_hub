from django.urls import path, include

urlpatterns = [
    path("auth/", include(("apps.authentication.urls", "authentication"))),
    path("users/", include(("apps.users.urls", "users"))),
    path("communities/", include(("apps.communities.urls", "communities"))),
    path("events/", include(("apps.events.urls", "events"))),
    path("friends/", include(("apps.friends.urls", "friends"))),

]
