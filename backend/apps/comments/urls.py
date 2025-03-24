from django.urls import path
from apps.comments.apis import (
    CommentListApi,
    CommentCreateApi,
    CommentDetailApi,
    CommentUpdateApi,
    CommentDeleteApi,
    PostCommentsListApi,
    UserCommentsListApi,
)

urlpatterns = [
    path("", CommentListApi.as_view(), name="list"),
    path("create/", CommentCreateApi.as_view(), name="create"),
    path("<int:comment_id>/", CommentDetailApi.as_view(), name="detail"),
    path("<int:comment_id>/update/", CommentUpdateApi.as_view(), name="update"),
    path("<int:comment_id>/delete/", CommentDeleteApi.as_view(), name="delete"),
    path(
        "post/<int:post_id>/", 
        PostCommentsListApi.as_view(), 
        name="post_comments",
    ),
    path("user/<int:user_id>/", UserCommentsListApi.as_view(), name="user_comments"),
]