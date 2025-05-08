from django.urls import path
from apps.reactions.apis import (
    CommentListApi,
    CommentCreateApi,
    CommentDetailApi,
    CommentUpdateApi,
    CommentDeleteApi,
    PostCommentsListApi,
    UserCommentsListApi,
    LikeCreateApi,
    UnlikeApi,
)

urlpatterns = [
    path("comments/", CommentListApi.as_view(), name="list"),
    path("comments/create/", CommentCreateApi.as_view(), name="create_comment"),
    path("<int:comment_id>/", CommentDetailApi.as_view(), name="detail"),
    path("<int:comment_id>/update/", CommentUpdateApi.as_view(), name="update"),
    path("<int:comment_id>/delete/", CommentDeleteApi.as_view(), name="delete"),
    path(
        "post/<int:post_id>/",
        PostCommentsListApi.as_view(),
        name="post_comments",
    ),
    path("user/<int:user_id>/", UserCommentsListApi.as_view(), name="user_comments"),
    path("likes/create/", LikeCreateApi.as_view(), name="create_like"),
    path("unlike/", UnlikeApi.as_view(), name="unlike"),
]
