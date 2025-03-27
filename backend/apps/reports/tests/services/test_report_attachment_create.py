from django.test import TestCase
from apps.reports.factories import ReportFactory
from apps.reports.services import report_attachment_create
from django.core.files.uploadedfile import SimpleUploadedFile
from apps.reports.models import ReportAttachment


class ReportAttachmentCreateTests(TestCase):
    
    def test_report_attachment_create_success(self):
        report = ReportFactory.create()
        file = SimpleUploadedFile(name="test_file.txt", content=b"Test content", content_type="text/plain")

        attachment = report_attachment_create(report=report, file=file, description="Test File")

        self.assertIsInstance(attachment, ReportAttachment)
        self.assertEqual(attachment.report, report)
        self.assertEqual(attachment.description, "Test File")
