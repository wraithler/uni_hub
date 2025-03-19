from django.urls import path

from apps.events.apis import (
    EventListApi,
    EventCreateApi,
    EventDetailApi,
    EventUpdateApi,
)

urlpatterns = [
    path("", EventListApi.as_view(), name="list"),
    path("create/", EventCreateApi.as_view(), name="create"),
    path("<int:event_id>/", EventDetailApi.as_view(), name="detail"),
    path("<int:event_id>/update/", EventUpdateApi.as_view(), name="update"),
]
