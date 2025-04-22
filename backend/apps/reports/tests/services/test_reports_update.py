from django.test import TestCase
from apps.reports.factories import ReportFactory
from apps.reports.services import report_update


class ReportUpdateTests(TestCase):
    def test_report_update_success(self):
        report = ReportFactory.create(
            title="Initial Report", description="Initial Description"
        )
        updated_report = report_update(
            report=report,
            data={
                "title": "Updated Report",
                "description": "Updated Description",
                "evidence_links": {"link1": "https://example.com"},
            },
        )
        self.assertEqual(updated_report.title, "Updated Report")
        self.assertEqual(updated_report.description, "Updated Description")
        self.assertEqual(updated_report.evidence_links["link1"], "https://example.com")
