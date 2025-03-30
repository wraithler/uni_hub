from django.test import TestCase
from apps.reports.factories import ReportAttachmentFactory
from apps.reports.selectors import report_attachment_get


class ReportAttachmentGetTests(TestCase):
    def test_report_attachment_get_with_no_objects(self):
        attachment = report_attachment_get(1)
        self.assertIsNone(attachment)

    def test_report_attachment_get_with_objects(self):
        attachment = ReportAttachmentFactory.create(description="Sample Attachment")
        result = report_attachment_get(attachment.id)
        self.assertIsNotNone(result)
        self.assertEqual(result.description, "Sample Attachment")
