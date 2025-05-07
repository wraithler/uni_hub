from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from apps.communities.models import Community
from apps.files.models import File
from apps.users.models import BaseModel


class Post(BaseModel):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created_by = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="posts"
    )
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="posts"
    )
    likes = GenericRelation("reactions.Like", related_query_name="likes")
    pinned = models.BooleanField(default=False)

    VISIBILITY_CHOICES = [("public", "Public"), ("members", "Members Only")]
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default="public"
    )

    class Meta:
        verbose_name_plural = "Posts"
        ordering = ["-created_at"]


class PostImages(BaseModel):
    id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image = models.ForeignKey(File, on_delete=models.CASCADE, related_name="images")

    class Meta:
        verbose_name_plural = "Post Images"