import math
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from api.user_manager import EmailUserManager


class User(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    academic_department = models.TextField(blank=True, null=True)
    year_of_study = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = EmailUserManager()

    # Remove unused fields
    first_name = None
    last_name = None

    @property
    def friends(self):
        return User.objects.filter(
            id__in=Friend.objects.filter(user1=self).values_list("user2", flat=True)
        ) | User.objects.filter(
            id__in=Friend.objects.filter(user2=self).values_list("user1", flat=True)
        )

    @property
    def events(self):
        return Events.objects.filter(
            id__in=EventAttendance.objects.filter(user=self).values_list(
                "event", flat=True
            )
        )


class CommunityCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()


class Community(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(CommunityCategory, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    emoji = models.CharField(max_length=255, blank=True, null=True)

    members = models.ManyToManyField(
        User, through="CommunityMembership", related_name="communities"
    )

    class Meta:
        ordering = ["-created_at"]


class CommunityMembership(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "community"]


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)

    @property
    def hours_since_posted(self):
        return (timezone.now() - self.created_at).total_seconds() // 3600

    def score(self, user):
        """
        score = (W1 * Engagement) + (W2 * Recency) + (W3 * Relevance) + (W4 * Connection)

        Engagement = (post.likes * 3) + (comments * 5) + (shares * 7)
        Recency = e^(-hours_since_posted / 6) (exponential decay)
        Relevance = 10 if post.community in user.communities else 0
        Connection = 15 if post.author in user.friends else 0
        """
        w1, w2, w3, w4 = 0.3, 0.2, 0.2, 0.3
        return (
                w1 * ((self.likes.count() * 3) + (self.comments.count() * 5))
                + w2 * (math.exp(-self.hours_since_posted / 6))
                + w3 * (10 if self.community in user.communities.all() else 0)
                + w4 * (15 if self.created_by in user.friends.all() else 0)
        )

    class Meta:
        ordering = ["-created_at"]


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")

    class Meta:
        ordering = ["-created_at"]


class Events(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    virtual_event = models.BooleanField(default=False)
    virtual_link = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def attendees(self):
        return User.objects.filter(
            id__in=EventAttendance.objects.filter(event=self).values_list(
                "user", flat=True
            )
        )


class EventAttendance(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["user", "event"]


class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]


class SearchHistory(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class SocialPlatforms(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    url = models.URLField()
    icon = models.ImageField(upload_to="social_icons/")

    class Meta:
        ordering = ["name"]


class UserSocialLinks(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    platform = models.ForeignKey(SocialPlatforms, on_delete=models.CASCADE)
    url = models.URLField()

    class Meta:
        unique_together = ["user", "platform"]


class PostLike(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")

    class Meta:
        unique_together = ["user", "post"]


class FriendRequest(models.Model):
    id = models.AutoField(primary_key=True)
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="from_user"
    )
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="to_user")
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ["from_user", "to_user"]


class Friend(models.Model):
    id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user2")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user1", "user2"]


class PostView(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "post"]
