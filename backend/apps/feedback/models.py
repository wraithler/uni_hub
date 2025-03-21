from django.db import models

from apps.common.models import BaseModel


class Feedback(BaseModel):
    id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, null=True, blank=True
    )
    content = models.TextField()
    rating = models.IntegerField(choices=[1, 2, 3, 4, 5])
    is_anonymous = models.BooleanField(default=False)
