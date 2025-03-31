from django.test import TestCase
from apps.reports.factories import ReportCategoryFactory
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.reports.services import report_create
from apps.reports.models import Report


class ReportCreateTests(TestCase):
    def test_report_create_success(self):
        user = BaseUserFactory.create()
        category = ReportCategoryFactory.create()
        community = CommunityFactory.create()

        report = report_create(
            title="Test Report",
            description="Report Description",
            reported_by=user,
            category=category,
            community=community,
        )
        self.assertIsInstance(report, Report)
        self.assertEqual(report.title, "Test Report")
        self.assertEqual(report.description, "Report Description")
        self.assertEqual(report.reported_by, user)
        self.assertEqual(report.category, category)
        self.assertEqual(report.community, community)
