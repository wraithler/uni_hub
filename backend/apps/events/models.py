from django.core.exceptions import ValidationError
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

    def clean(self):
        if self.starts_at > self.ends_at:
            raise ValidationError("The event cannot end before it starts.")

        if self.is_virtual_event and not self.virtual_link:
            raise ValidationError("A virtual event must have a virtual link.")


class EventAttendee(BaseModel):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(
        "events.Event", on_delete=models.CASCADE, related_name="attendees"
    )
    user = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
