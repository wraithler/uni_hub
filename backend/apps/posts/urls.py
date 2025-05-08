from django.urls import path

from apps.posts.apis import (
    PostListApi,
    PostCreateApi,
    PostUpdateApi,
    PostDeleteApi,
)

urlpatterns = [
    path("", PostListApi.as_view(), name="list"),
    path("create/", PostCreateApi.as_view(), name="create"),
    path("<int:post_id>/update/", PostUpdateApi.as_view(), name="update"),
    path("<int:post_id>/delete/", PostDeleteApi.as_view(), name="delete"),
]
