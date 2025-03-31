from django.urls import path

from apps.friends.apis import (
    FriendRequestSendApi,
    FriendRequestListApi,
    FriendRequestRespondApi,
)

urlpatterns = [
    path("requests/send/", FriendRequestSendApi.as_view(), name="send-request"),
    path("requests/", FriendRequestListApi.as_view(), name="list-requests"),
    path(
        "requests/<int:request_id>/respond/",
        FriendRequestRespondApi.as_view(),
        name="respond-request",
    ),
]
