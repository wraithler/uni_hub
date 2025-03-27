import django_filters
from .models import Notification

class NotificationFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name="user", lookup_expr="exact")
    is_read = django_filters.BooleanFilter(field_name="is_read", lookup_expr="exact")
    is_important = django_filters.BooleanFilter(field_name="is_important", lookup_expr="exact")
    notification_type = django_filters.ChoiceFilter(
        field_name="notification_type",
        choices=Notification.NotificationType.choices,
        lookup_expr="exact"
    )
    created_at = django_filters.DateFromToRangeFilter(field_name="created_at")

    class Meta:
        model = Notification
        fields = ['user', 'is_read', 'is_important', 'notification_type', 'created_at']
