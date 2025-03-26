from django.db import models

from apps.common.models import BaseModel


class Feedback(BaseModel):
    id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, null=True, blank=True
    )
    content = models.TextField()
    is_anonymous = models.BooleanField(default=False)

    class Rating(models.IntegerChoices):
        ONE = 1, "1 - Poor"
        TWO = 2, "2 - Fair"
        THREE = 3, "3 - Good"
        FOUR = 4, "4 - Very Good"
        FIVE = 5, "5 - Excellent"

    rating = models.IntegerField(choices=Rating.choices, db_index=True)

    class Meta:
        verbose_name_plural = "Feedback"
