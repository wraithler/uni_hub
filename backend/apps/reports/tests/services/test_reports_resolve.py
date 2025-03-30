from django.test import TestCase
from apps.reports.factories import ReportFactory
from apps.users.factories import BaseUserFactory
from apps.reports.services import report_resolve
from apps.reports.models import ReportStatus
from apps.core.exceptions import ApplicationError



class ReportResolveTests(TestCase):
    
    def test_report_resolve_success(self):
        user = BaseUserFactory.create()
        report = ReportFactory.create(status=ReportStatus.PENDING)

        resolved_report = report_resolve(
            report=report, 
            status=ReportStatus.RESOLVED, 
            resolved_by=user, 
            resolution_notes="Issue resolved successfully"
        )

        self.assertEqual(resolved_report.status, ReportStatus.RESOLVED)
        self.assertEqual(resolved_report.reviewed_by, user)
        self.assertEqual(resolved_report.resolution_notes, "Issue resolved successfully")

    def test_report_resolve_failure_invalid_status(self):
        user = BaseUserFactory.create()
        report = ReportFactory.create(status=ReportStatus.PENDING)

        with self.assertRaises(ApplicationError):
            report_resolve(
                report=report, 
                status="INVALID_STATUS", 
                resolved_by=user
            )
