from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .apis import (
    UserMeApi,
    UserSessionLoginApi,
    UserSessionLogoutApi,
)

urlpatterns = [
    path(
        "session/",
        include(
            (
                [
                    path("login/", UserSessionLoginApi.as_view(), name="login"),
                    path("logout/", UserSessionLogoutApi.as_view(), name="logout"),
                ],
                "session",
            )
        ),
    ),
    path(
        "token/",
        include(
            (
                [
                    path("", TokenObtainPairView.as_view(), name="token-obtain-pair"),
                    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
                ],
                "token",
            )
        ),
    ),
    path("me/", UserMeApi.as_view(), name="me"),
]
