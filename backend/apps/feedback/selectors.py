from typing import Optional

from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.feedback.filters import FeedbackFilter
from apps.feedback.models import Feedback


def feedback_get(feedback_id) -> Optional[Feedback]:
    feedback = get_object(Feedback, id=feedback_id)

    return feedback


def feedback_list(*, filters=None) -> QuerySet[Feedback]:
    filters = filters or {}

    qs = Feedback.objects.all()

    return FeedbackFilter(filters, qs).qs
