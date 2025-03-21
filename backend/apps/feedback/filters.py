import django_filters

from apps.feedback.models import Feedback


class FeedbackFilter(django_filters.FilterSet):
    class Meta:
        model = Feedback
        fields = (
            "id",
            "rating",
            "created_by",
            "is_anonymous",
        )
