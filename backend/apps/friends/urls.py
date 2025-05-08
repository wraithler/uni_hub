from django.urls import path

from apps.friends.apis import (
    FriendRequestSendApi,
    ReceivedFriendRequestsListApi,
    AcceptFriendRequestApi,
    UnfriendApi,
    FriendListApi,
)

urlpatterns = [
    path("send/", FriendRequestSendApi.as_view(), name="friend-request-send"),
    path("received/", ReceivedFriendRequestsListApi.as_view(), name="friend-requests-received"),
    path("accept/", AcceptFriendRequestApi.as_view(), name="friend-request-accept"),
    path("unfriend/", UnfriendApi.as_view(), name="friend-unfriend"),
    path("list/", FriendListApi.as_view(), name="friend-list"),
]