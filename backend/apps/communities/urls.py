from django.urls import path

from apps.communities.apis import CommunityListApi, CommunityCreateApi, CommunityDetailApi, CommunityUpdateApi

urlpatterns = [
    path("", CommunityListApi.as_view(), name="list"),
    path("create/", CommunityCreateApi.as_view(), name="create"),
    path("<int:community_id>/", CommunityDetailApi.as_view(), name="detail"),
    path("<int:community_id>/update/", CommunityUpdateApi.as_view(), name="update"),
]