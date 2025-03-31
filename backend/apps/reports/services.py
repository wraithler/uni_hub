from typing import List, Dict, Any, Optional
from django.db import transaction
from django.core.files.uploadedfile import UploadedFile

from apps.common.services import model_update
from apps.core.exceptions import ApplicationError
from apps.reports.models import Report, ReportCategory, ReportAttachment, ReportStatus
from apps.users.models import BaseUser
from apps.communities.models import Community


@transaction.atomic
def report_category_create(
    *, name: str, description: str, is_active: bool = True
) -> ReportCategory:
    category = ReportCategory.objects.create(
        name=name, description=description, is_active=is_active
    )
    return category


@transaction.atomic
def report_category_update(
    *, report_category: ReportCategory, data: Dict[str, Any]
) -> ReportCategory:
    non_side_effect_fields: List[str] = ["name", "description", "is_active"]
    report_category, _ = model_update(
        instance=report_category, fields=non_side_effect_fields, data=data
    )
    return report_category


@transaction.atomic
def report_create(
    *,
    title: str,
    description: str,
    reported_by: BaseUser,
    category: ReportCategory,
    reported_user: Optional[BaseUser] = None,
    community: Optional[Community] = None,
    evidence_links: Optional[Dict[str, str]] = None,
) -> Report:
    report = Report.objects.create(
        title=title,
        description=description,
        reported_by=reported_by,
        category=category,
        reported_user=reported_user,
        community=community,
        status=ReportStatus.PENDING,
        evidence_links=evidence_links or {},
    )
    return report


@transaction.atomic
def report_update(*, report: Report, data: Dict[str, Any]) -> Report:
    non_side_effect_fields: List[str] = ["title", "description", "evidence_links"]

    report, has_updated = model_update(
        instance=report, fields=non_side_effect_fields, data=data
    )
    return report


@transaction.atomic
def report_resolve(
    *,
    report: Report,
    status: ReportStatus,
    resolved_by: BaseUser,
    resolution_notes: Optional[str] = None,
) -> Report:
    if status not in [
        ReportStatus.RESOLVED,
        ReportStatus.CLOSED,
        ReportStatus.REJECTED,
    ]:
        raise ApplicationError("Invalid report resolution status")

    update_data = {
        "status": status,
        "resolution_notes": resolution_notes,
        "reviewed_by": resolved_by,
    }

    for key, value in update_data.items():
        setattr(report, key, value)

    report.save()

    return report


@transaction.atomic
def report_attachment_create(
    *,
    report: Report,
    file: UploadedFile,
    description: Optional[str] = None,
) -> ReportAttachment:
    attachment = ReportAttachment.objects.create(
        report=report, file=file, description=description
    )
    return attachment


@transaction.atomic
def report_attachment_delete(
    *,
    attachment: ReportAttachment,
) -> None:
    attachment.delete()
