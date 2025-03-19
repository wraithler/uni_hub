from django.db import models

from apps.common.models import BaseModel


class Event(BaseModel):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()

    location = models.CharField(max_length=255)  # TODO: Move to an address model

    created_by = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    community = models.ForeignKey("communities.Community", on_delete=models.CASCADE)

    is_virtual_event = models.BooleanField(default=False)
    virtual_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title


class EventAttendee(BaseModel):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(
        "events.Event", on_delete=models.CASCADE, related_name="attendees"
    )
    user = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
