from django.db import models
from django.db.models import Q

from apps.common.models import BaseModel


class CommunityTag(BaseModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = "Community Tags"

    def __str__(self):
        return self.name


class CommunityCategory(BaseModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = "Community Categories"

    def __str__(self):
        return self.name


class Community(BaseModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    tags = models.ManyToManyField(CommunityTag, related_name="communities")
    category = models.ForeignKey(
        CommunityCategory, on_delete=models.CASCADE, related_name="communities"
    )
    created_by = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    is_featured = models.BooleanField(default=False)
    about = models.TextField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    avatar = models.ForeignKey(
        "files.File",
        on_delete=models.SET_NULL,
        related_name="community_avatar",
        null=True,
        blank=True,
    )
    banner = models.ForeignKey(
        "files.File",
        on_delete=models.SET_NULL,
        related_name="community_banner",
        null=True,
        blank=True,
    )

    PRIVACY_OPTIONS = (
        ("public", "Public"),
        ("restricted", "Restricted"),
        ("private", "Private"),
    )

    privacy = models.CharField(max_length=10, choices=PRIVACY_OPTIONS, default="public")

    class Meta:
        verbose_name_plural = "Communities"

    def __str__(self):
        return self.name

    def is_member(self, user):
        return self.memberships.filter(user=user).exists()

    def is_admin(self, user):
        return self.memberships.filter(user=user, is_admin=True).exists()

    def is_moderator(self, user):
        return (
            self.memberships.filter(user=user)
            .filter(Q(is_moderator=True) | Q(is_admin=True))
            .exists()
        )

    def has_requested_to_join(self, user):
        return self.join_requests.filter(user=user).exists()


class CommunityMembership(BaseModel):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="memberships"
    )
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="memberships"
    )
    is_admin = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    class Meta:
        unique_together = ["user", "community"]


class CommunityInvitation(BaseModel):
    id = models.AutoField(primary_key=True)
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="invitations"
    )
    user = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="invitations"
    )
    is_accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ["community", "user"]


class CommunityGuidelines(BaseModel):
    id = models.AutoField(primary_key=True)
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="guidelines"
    )
    content = models.TextField()

    class Meta:
        verbose_name_plural = "Community Guidelines"


class CommunityJoinRequest(BaseModel):
    id = models.AutoField(primary_key=True)
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name="join_requests"
    )
    user = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="join_requests"
    )
    is_accepted = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)

    class Meta:
        unique_together = ["community", "user"]
