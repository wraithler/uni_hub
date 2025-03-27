from django.urls import path
from apps.posts.apis import (
    PostListApi,
    PostCreateApi,
    PostDetailApi,
    PostUpdateApi,
    PostDeleteApi,
    CommunityPostsListApi,
    UserPostsListApi,
)

urlpatterns = [
    path("", PostListApi.as_view(), name="list"),
    path("create/", PostCreateApi.as_view(), name="create"),
    path("<int:post_id>/", PostDetailApi.as_view(), name="detail"),
    path("<int:post_id>/update/", PostUpdateApi.as_view(), name="update"),
    path("<int:post_id>/delete/", PostDeleteApi.as_view(), name="delete"),
    path(
        "community/<int:community_id>/",
        CommunityPostsListApi.as_view(),
        name="community_posts",
    ),
    path("user/<int:user_id>/", UserPostsListApi.as_view(), name="user_posts"),
]
