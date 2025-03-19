from django.db import models

from apps.common.models import BaseModel


class Email(BaseModel):
    class Status(models.TextChoices):
        READY = "READY", "Ready"
        SENDING = "SENDING", "Sending"
        SENT = "SENT", "Sent"
        FAILED = "FAILED", "Failed"

    status = models.CharField(
        max_length=255, choices=Status.choices, default=Status.READY, db_index=True
    )

    to = models.EmailField()
    subject = models.CharField(max_length=255)

    html = models.TextField()
    plain_text = models.TextField(blank=True, null=True)

    sent_at = models.DateTimeField(null=True, blank=True)
