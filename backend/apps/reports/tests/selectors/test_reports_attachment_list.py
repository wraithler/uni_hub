from django.test import TestCase
from apps.reports.factories import ReportAttachmentFactory
from apps.reports.selectors import report_attachment_list


class ReportAttachmentListTests(TestCase):
    def test_report_attachment_list_without_filters(self):
        ReportAttachmentFactory.create_batch(2)
        attachments = report_attachment_list(filters={})
        self.assertEqual(attachments.count(), 2)

    def test_report_attachment_list_with_filters(self):
        ReportAttachmentFactory.create(description="Attachment 1")
        ReportAttachmentFactory.create(description="Attachment 2")

        attachments = report_attachment_list(filters={"description": "Attachment 1"})
        self.assertEqual(attachments.count(), 1)
        self.assertEqual(attachments.first().description, "Attachment 1")
