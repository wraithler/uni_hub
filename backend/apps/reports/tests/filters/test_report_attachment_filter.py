from django.test import TestCase
from apps.reports.factories import ReportFactory, ReportAttachmentFactory
from apps.reports.selectors import report_attachment_list

class ReportAttachmentFilterTests(TestCase):
    def setUp(self):

        self.report1 = ReportFactory.create()
        self.report2 = ReportFactory.create()

    def test_filter_by_report(self):

        ReportAttachmentFactory.create_batch(3, report=self.report1)
        ReportAttachmentFactory.create_batch(2, report=self.report2)

        attachments = report_attachment_list(filters={"report": self.report1.id})
        self.assertEqual(len(attachments), 3)
        
        attachments = report_attachment_list(filters={"report": self.report2.id})
        self.assertEqual(len(attachments), 2)