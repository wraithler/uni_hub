from django.db import models
from django.utils import timezone
import math
from apps.users.models import BaseModel
from apps.posts.models import Post

class Comment(BaseModel):
    content = models.TextField()
    created_by = models.ForeignKey(
        "users.BaseUser", 
        on_delete=models.CASCADE, 
        related_name="comments"
    )
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name="comments" 
    )
    
    class Meta:
        verbose_name_plural = "Comments"
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"Comment by {self.created_by} on {self.post}"
    
    @property
    def hours_since_commented(self):
        return (timezone.now() - self.created_at).total_seconds() // 3600

class Like(models.Model):
    user = models.ForeignKey(
        "users.BaseUser", 
        on_delete=models.CASCADE,
        related_name="comment_likes"
    )
    comment = models.ForeignKey(
        Comment, 
        on_delete=models.CASCADE, 
        related_name="likes"
    )
    
    class Meta:
        unique_together = ["user", "comment"]
        verbose_name_plural = "Comment Likes"


class PostLike(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")

    class Meta:
        unique_together = ["user", "post"]
