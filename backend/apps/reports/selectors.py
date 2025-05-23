from typing import Optional
from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.reports.filters import (
    ReportFilter,
    ReportCategoryFilter,
    ReportAttachmentFilter,
)
from apps.reports.models import Report, ReportCategory, ReportAttachment


def report_get(report_id) -> Optional[Report]:
    report = get_object(Report, id=report_id)
    return report


def report_list(*, filters=None, request=None) -> QuerySet[Report]:
    filters = filters or {}
    qs = Report.objects.all()
    return ReportFilter(filters, qs, request=request).qs


def report_category_get(report_category_id) -> Optional[ReportCategory]:
    report_category = get_object(ReportCategory, id=report_category_id)
    return report_category


def report_category_list(*, filters=None) -> QuerySet[ReportCategory]:
    filters = filters or {}
    qs = ReportCategory.objects.all()
    return ReportCategoryFilter(filters, qs).qs


def report_attachment_get(report_attachment_id) -> Optional[ReportAttachment]:
    report_attachment = get_object(ReportAttachment, id=report_attachment_id)
    return report_attachment


def report_attachment_list(*, filters=None) -> QuerySet[ReportAttachment]:
    filters = filters or {}
    qs = ReportAttachment.objects.all()
    return ReportAttachmentFilter(filters, qs).qs
