from django.db import models
from django.utils import timezone
import math
from apps.users.models import BaseModel
from apps.communities.models import Community


class Post(BaseModel):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_by = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="posts"
    )

    class Meta:
        verbose_name_plural = "Posts"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    @property
    def hours_since_posted(self):
        return (timezone.now() - self.created_at).total_seconds() // 3600

    def score(self, user):
        w1, w2, w3, w4 = 0.3, 0.2, 0.2, 0.3

        engagement_score = (self.likes.count() * 3) + (self.comments.count() * 5)
        relevance_score = 100 if self.community.is_member(user) else 0
        connection_score = (
            150 if user.friends.filter(id=self.created_by.id).exists() else 0
        )

        scaling_factor = max(1, engagement_score / 100)
        recency_score = math.exp(-self.hours_since_posted / 6)

        return (
            w1 * scaling_factor
            + w2 * recency_score
            + w3 * relevance_score
            + w4 * connection_score
        )


class PostLike(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")

    class Meta:
        unique_together = ["user", "post"]


# class PostUnlike(models.Model):
#     id = models.AutoField(primary_key=True)
#     user = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
#     post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="unlikes")

#     class Meta:
#         unique_together = ["user", "post"]


class PostComment(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")

    class Meta:
        ordering = ["-created_at"]
