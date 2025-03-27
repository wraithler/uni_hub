from django.db import models

from apps.common.models import BaseModel


class Notification(BaseModel):
    id = models.AutoField(primary_key=True)
    
    
    user = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="received_notifications"
    )
    
    
    sender = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="sent_notifications", null=True, blank=True
    )
    
   
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    
    is_read = models.BooleanField(default=False)
    is_important = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    
    
    class NotificationType(models.TextChoices):
        INFO = "INFO", "Information"
        WARNING = "WARNING", "Warning"
        ERROR = "ERROR", "Error"
        SUCCESS = "SUCCESS", "Success"
    
    notification_type = models.CharField(
        max_length=20, choices=NotificationType.choices, default=NotificationType.INFO
    )
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user} - {self.notification_type}"

    
    def mark_as_read(self):
        self.is_read = True
        self.save()

    
    def mark_as_unread(self):
        self.is_read = False
        self.save()
