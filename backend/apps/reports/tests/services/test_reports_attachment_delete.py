from django.test import TestCase
from apps.reports.factories import ReportAttachmentFactory
from apps.reports.services import report_attachment_delete
from apps.reports.models import ReportAttachment


class ReportAttachmentDeleteTests(TestCase):
    def test_report_attachment_delete_success(self):
        attachment = ReportAttachmentFactory.create()

        report_attachment_delete(attachment=attachment)

        self.assertFalse(ReportAttachment.objects.filter(id=attachment.id).exists())
