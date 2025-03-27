from django.urls import path

from apps.communities.apis import (
    CommunityListApi,
    CommunityCreateApi,
    CommunityDetailApi,
    CommunityUpdateApi,
    CommunityEventsListApi, CommunityJoinApi,
)

urlpatterns = [
    path("", CommunityListApi.as_view(), name="list"),
    path("create/", CommunityCreateApi.as_view(), name="create"),
    path("<int:community_id>/", CommunityDetailApi.as_view(), name="detail"),
    path("<int:community_id>/update/", CommunityUpdateApi.as_view(), name="update"),
    path("<int:community_id>/events/", CommunityEventsListApi.as_view(), name="events"),
    path("<int:community_id>/join/", CommunityJoinApi.as_view(), name="join"),
]
