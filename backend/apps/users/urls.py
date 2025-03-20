from django.urls import path

from apps.users.apis import (
    UserCreateApi,
    UserDetailApi,
    UserListApi,
    UserUpdateApi,
    UserCommunitiesListApi,
)

urlpatterns = [
    path("", UserListApi.as_view(), name="list"),
    path("create/", UserCreateApi.as_view(), name="create"),
    path("<int:user_id>/", UserDetailApi.as_view(), name="detail"),
    path("<int:user_id>/update/", UserUpdateApi.as_view(), name="update"),
    path("communities/", UserCommunitiesListApi.as_view(), name="communities"),
]
