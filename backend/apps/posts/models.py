from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.utils import timezone

from apps.communities.models import Community
from apps.users.models import BaseModel


class Post(BaseModel):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created_by = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE, related_name="posts")
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="posts"
    )
    likes = GenericRelation("reactions.Like", related_query_name="likes")

    class Meta:
        verbose_name_plural = "Posts"
        ordering = ["-created_at"]

    @property
    def hours_since_posted(self):
        return (timezone.now() - self.created_at).total_seconds() // 3600

    def time_since_posted(self):
        hours = self.hours_since_posted
        if hours < 1:
            return f"{int(hours * 60)}m"
        if hours < 24:
            return f"{int(hours)}h"
        return f"{int(hours // 24)}d"
