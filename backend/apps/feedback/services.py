from apps.common.services import model_update
from apps.feedback.models import Feedback
from apps.users.models import BaseUser


def feedback_create(
    *, content: str, rating: int, is_anonymous: bool, created_by: BaseUser = None
) -> Feedback:
    feedback = Feedback.objects.create(
        content=content, rating=rating, is_anonymous=is_anonymous, created_by=created_by
    )

    return feedback


def feedback_update(*, feedback: Feedback, data) -> Feedback:
    non_side_effect_fields = []

    feedback, has_updated = model_update(
        instance=feedback, fields=non_side_effect_fields, data=data
    )

    return feedback
