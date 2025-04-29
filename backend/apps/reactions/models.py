from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils import timezone

from apps.posts.models import Post
from apps.users.models import BaseModel


class Like(models.Model):
    user = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="likes"
    )

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        unique_together = ["user", "content_type", "object_id"]
        verbose_name_plural = "Comment Likes"


class Comment(BaseModel):
    content = models.TextField()
    created_by = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="comments"
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    likes = GenericRelation(Like, related_query_name="likes")

    class Meta:
        verbose_name_plural = "Comments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Comment by {self.created_by} on {self.post}"

    @property
    def hours_since_commented(self):
        return (timezone.now() - self.created_at).total_seconds() // 3600
