from django.test import TestCase
from apps.reports.factories import ReportFactory
from apps.reports.selectors import report_get


class ReportGetTests(TestCase):
    def test_report_get_with_no_objects(self):
        report = report_get(1)
        self.assertIsNone(report)

    def test_report_get_with_objects(self):
        report = ReportFactory.create(title="Sample Report")
        result = report_get(report.id)
        self.assertIsNotNone(result)
        self.assertEqual(result.title, "Sample Report")
