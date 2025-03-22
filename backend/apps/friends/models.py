from django.db import models

from apps.common.models import BaseModel


class FriendRequest(BaseModel):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="sent_friend_requests"
    )
    receiver = models.ForeignKey(
        "users.BaseUser",
        on_delete=models.CASCADE,
        related_name="received_friend_requests",
    )
    is_accepted = models.BooleanField(default=False)
    is_declined = models.BooleanField(default=False)

    class Meta:
        unique_together = ["sender", "receiver"]


class Friend(BaseModel):
    user = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="friendships"
    )
    friend = models.ForeignKey(
        "users.BaseUser", on_delete=models.CASCADE, related_name="friends"
    )

    class Meta:
        unique_together = ["user", "friend"]
