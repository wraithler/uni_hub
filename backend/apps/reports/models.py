from django.db import models

from apps.common.models import BaseModel

class ReportCategory(BaseModel):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Report Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

class ReportStatus(models.TextChoices):

    PENDING = 'PENDING', 'Pending'
    UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
    RESOLVED = 'RESOLVED', 'Resolved'
    CLOSED = 'CLOSED', 'Closed'
    REJECTED = 'REJECTED', 'Rejected'

class Report(BaseModel):

    id = models.AutoField(primary_key=True)

    reported_by = models.ForeignKey(
        "users.BaseUser", 
        on_delete=models.CASCADE, 
        related_name="submitted_reports"
    )

    reported_user = models.ForeignKey(
        "users.BaseUser", 
        on_delete=models.SET_NULL, 
        related_name="reports_against_me", 
        blank=True, 
        null=True
    )

    community = models.ForeignKey(
        "communities.Community", 
        on_delete=models.SET_NULL, 
        related_name="reports", 
        blank=True, 
        null=True
    )

    category = models.ForeignKey(
        ReportCategory, 
        on_delete=models.PROTECT, 
        related_name="reports"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
 
    evidence_links = models.JSONField(blank=True, null=True)

    status = models.CharField(
        max_length=20, 
        choices=ReportStatus.choices, 
        default=ReportStatus.PENDING
    )

    reviewed_by = models.ForeignKey(
        "users.BaseUser", 
        on_delete=models.SET_NULL, 
        related_name="reviewed_reports", 
        blank=True, 
        null=True
    )
    resolution_notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Reports"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['reported_by', 'status'])
        ]

    def __str__(self):
        return f"Report {self.id}: {self.title}"

    def can_be_modified(self, user):
        return (
            user == self.reported_by or 
            (self.community and self.community.is_moderator(user)) or
            (self.community and self.community.is_admin(user))
        )

class ReportAttachment(BaseModel):

    id = models.AutoField(primary_key=True)
    report = models.ForeignKey(
        Report, 
        on_delete=models.CASCADE, 
        related_name="attachments"
    )
    file = models.FileField(upload_to='report_attachments/')
    description = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Report Attachments"

    def __str__(self):
        return f"Attachment for Report {self.report_id}"