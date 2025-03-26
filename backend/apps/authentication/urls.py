from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.authentication.apis import (
    UserMeApi,
)

urlpatterns = [
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
