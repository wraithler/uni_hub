import django_filters
from django_filters import DateFromToRangeFilter, BooleanFilter, CharFilter
from apps.notifications.models import Notification

class NotificationFilter(django_filters.FilterSet):
    created_at = DateFromToRangeFilter()
    is_read = BooleanFilter()
    notification_type = CharFilter(lookup_expr='icontains')
    recipient__email = CharFilter(field_name='recipient__email', lookup_expr='icontains')
    
    class Meta:
        model = Notification
        fields = (
            "id",
            "is_read",
            "notification_type",
            "recipient",
            "recipient__email",
            "created_at",
        )