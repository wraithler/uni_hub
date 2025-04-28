from django.db import models
from apps.common.models import BaseModel

class Notification(BaseModel):
    id = models.AutoField(primary_key=True)
    recipient = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    class NotificationType(models.TextChoices):
        INFO = "info", "Info"
        ALERT = "alert", "Alert"
        REMINDER = "reminder", "Reminder"
        PROMO = "promo", "Promotional"
        EVENT = "event", "Event"
        POST = "post", "Post"
        ANNOUNCEMENT = "announcement", "Announcement"
        
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.INFO,
        db_index=True,
    )
    
    class Meta:
        verbose_name_plural = "Notifications"
        ordering = ["-created_at"]
