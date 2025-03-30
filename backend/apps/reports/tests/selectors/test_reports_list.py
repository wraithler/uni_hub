from django.test import TestCase
from apps.reports.factories import ReportFactory
from apps.reports.filters import ReportFilter
from apps.reports.selectors import report_list


class ReportListTests(TestCase):
    def test_report_list_without_filters(self):
        ReportFactory.create_batch(3)
        reports = report_list(filters={})
        self.assertEqual(reports.count(), 3)

    def test_report_list_with_filters(self):
        ReportFactory.create(status="PENDING")
        ReportFactory.create(status="RESOLVED")

        reports = report_list(filters={"status": "PENDING"})
        self.assertEqual(reports.count(), 1)
        self.assertEqual(reports.first().status, "PENDING")
