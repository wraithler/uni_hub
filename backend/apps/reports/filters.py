import django_filters
from apps.reports.models import Report, ReportCategory, ReportAttachment

class ReportFilter(django_filters.FilterSet):

    is_my_report = django_filters.BooleanFilter(method="filter_my_reports")
    status = django_filters.CharFilter(field_name="status")
    category_name = django_filters.CharFilter(field_name="category__name")
    reported_user = django_filters.NumberFilter(field_name="reported_user__id")
    community = django_filters.NumberFilter(field_name="community__id")
    date_from = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='lte')

    class Meta:
        model = Report
        fields = (
            "id", 
            "reported_by", 
            "reported_user", 
            "community", 
            "category", 
            "status", 
            "title"
        )

    def filter_my_reports(self, queryset, name, value):

        if value:
            return queryset.filter(reported_by=self.request.user)
        return queryset

class ReportCategoryFilter(django_filters.FilterSet):

    is_active = django_filters.BooleanFilter(field_name="is_active")

    class Meta:
        model = ReportCategory
        fields = ("id", "name", "description", "is_active")

class ReportAttachmentFilter(django_filters.FilterSet):

    report = django_filters.NumberFilter(field_name="report__id")

    class Meta:
        model = ReportAttachment
        fields = ("id", "report", "description")