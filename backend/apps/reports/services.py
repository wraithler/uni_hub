from typing import List, Dict, Any, Optional
from django.db import transaction
from django.core.files.uploadedfile import UploadedFile

from apps.common.services import model_update
from apps.core.exceptions import ApplicationError
from apps.reports.models import Report, ReportCategory, ReportAttachment, ReportStatus
from apps.users.models import BaseUser
from apps.communities.models import Community
from apps.posts.models import Post 


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


def get_or_create_default_categories():
    """Create default categories if none exist"""
    if ReportCategory.objects.count() == 0:
        default_categories = [
            {"name": "Inappropriate Content", "description": "Content that violates community guidelines"},
            {"name": "Harassment", "description": "Content targeting individuals negatively"},
            {"name": "Spam", "description": "Repetitive or irrelevant content"},
            {"name": "Other", "description": "Any other issues not covered by other categories"}
        ]
        
        for category_data in default_categories:
            ReportCategory.objects.create(**category_data)

    try:
        return ReportCategory.objects.first()
    except ReportCategory.DoesNotExist:
        return ReportCategory.objects.create(
            name="Other", 
            description="Default category for reports",
            is_active=True
        )


@transaction.atomic
def report_create(
    *,
    title: str,
    description: str,
    reported_by: BaseUser,
    category: Optional[int] = None, 
    reported_user: Optional[int] = None,
    community: Optional[int] = None,
    evidence_links: Optional[Dict[str, str]] = None,
    post: Optional[int] = None,
) -> Report:
    category_obj = None
    if category is not None:
        try:
            category_obj = ReportCategory.objects.get(id=category)
        except ReportCategory.DoesNotExist:
            pass

    if category_obj is None:
        category_obj = get_or_create_default_categories()

    reported_user_obj = None
    if reported_user is not None:
        try:
            reported_user_obj = BaseUser.objects.get(id=reported_user)
        except BaseUser.DoesNotExist:
            pass

    community_obj = None
    if community is not None:
        try:
            community_obj = Community.objects.get(id=community)
        except Community.DoesNotExist:
            pass

    post_obj = None
    if post is not None:
        try:
            post_obj = Post.objects.get(id=post)
        except Post.DoesNotExist:
            pass
    
    report = Report.objects.create(
        title=title,
        description=description,
        reported_by=reported_by,
        category=category_obj,
        reported_user=reported_user_obj,
        community=community_obj,
        post=post_obj,
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