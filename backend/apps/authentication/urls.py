from django.urls import path

from apps.authentication.apis import (
    UserMeApi,
    UserCSRFCookieApi,
    UserLoginApi,
    UserRegisterApi,
    UserLogoutApi,
)

urlpatterns = [
    path("get-csrf-token/", UserCSRFCookieApi.as_view(), name="get-csrf-token"),
    path("login/", UserLoginApi.as_view(), name="login"),
    path("register/", UserRegisterApi.as_view(), name="register"),
    path("logout/", UserLogoutApi.as_view(), name="logout"),
    path("me/", UserMeApi.as_view(), name="me"),
]
