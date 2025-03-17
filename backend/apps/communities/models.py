from django.db import models

from apps.common.models import BaseModel


class CommunityCategory(BaseModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    is_private = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Community Categories"

    def __str__(self):
        return self.name


class Community(BaseModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    category = models.ForeignKey(CommunityCategory, on_delete=models.CASCADE)
    created_by = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    emoji = models.CharField(max_length=255, blank=True, null=True)
    is_private = models.BooleanField(default=False)

    members = models.ManyToManyField(
        "users.BaseUser", through="CommunityMembership", related_name="communities"
    )

    class Meta:
        verbose_name_plural = "Communities"

    def __str__(self):
        return self.name

class CommunityMembership(BaseModel):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey("users.BaseUser", on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)

    class Meta:
        unique_together = ["user", "community"]
