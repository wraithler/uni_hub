from django.urls import path

from apps.events.apis import (
    EventListApi,
    EventCreateApi,
    EventDetailApi,
    EventUpdateApi,
    EventTicketCreateApi,
    EventTicketUpdateApi,
)

urlpatterns = [
    path("", EventListApi.as_view(), name="list"),
    path("create/", EventCreateApi.as_view(), name="create"),
    path("<int:event_id>/", EventDetailApi.as_view(), name="detail"),
    path("<int:event_id>/update/", EventUpdateApi.as_view(), name="update"),
    path(
        "<int:event_id>/ticket/", EventTicketCreateApi.as_view(), name="generate-ticket"
    ),
    path(
        "tickets/<int:ticket_id>/update/",
        EventTicketUpdateApi.as_view(),
        name="update-ticket",
    ),
]
