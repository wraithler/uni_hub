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
        related_name="comments_on_post" 
    )
    
    class Meta:
        verbose_name_plural = "Comments"
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"Comment by {self.created_by} on {self.post}"
    
    @property
    def hours_since_commented(self):
        return (timezone.now() - self.created_at).total_seconds() // 3600
    
    def score(self, user):
        w1, w2, w3, w4 = 0.3, 0.2, 0.2, 0.3
        
        engagement_score = (self.likes.count() * 3)
        relevance_score = 100 if self.post.community.is_member(user) else 0
        connection_score = (
            150 if user.friends.filter(id=self.created_by.id).exists() else 0
        )
        
        scaling_factor = max(1, engagement_score / 100)
        recency_score = math.exp(-self.hours_since_commented / 6)
        
        return (
            w1 * scaling_factor
            + w2 * recency_score
            + w3 * relevance_score
            + w4 * connection_score
        )

class CommentLike(models.Model):
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