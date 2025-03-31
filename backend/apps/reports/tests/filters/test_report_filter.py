from django.test import TestCase
from apps.reports.factories import ReportFactory, ReportCategoryFactory
from apps.users.factories import BaseUserFactory
from apps.communities.factories import CommunityFactory
from apps.reports.selectors import report_list
from apps.reports.models import ReportStatus


class ReportFilterTests(TestCase):
    def test_report_filter_by_title(self):
        ReportFactory.create(title="Harassment Report 1")
        ReportFactory.create(title="Spam Report 2")

        reports = report_list(filters={"title": "Harassment Report 1"})
        self.assertEqual(len(reports), 1)

    def test_report_filter_by_description(self):
        ReportFactory.create(description="Detailed harassment description")
        ReportFactory.create(description="Another report description")

        reports = report_list(
            filters={"description": "Detailed harassment description"}
        )
        self.assertEqual(len(reports), 2)

    def test_report_filter_by_reported_by(self):
        user = BaseUserFactory.create()
        ReportFactory.create_batch(5, reported_by=user)
        ReportFactory.create_batch(3)

        reports = report_list(filters={"reported_by": user})
        self.assertEqual(len(reports), 5)

    def test_report_filter_by_reported_user(self):
        user = BaseUserFactory.create()
        ReportFactory.create_batch(4, reported_user=user)
        ReportFactory.create_batch(3)

        reports = report_list(filters={"reported_user": user})
        self.assertEqual(len(reports), 7)

    def test_report_filter_by_community(self):
        community = CommunityFactory.create()
        ReportFactory.create_batch(10, community=community)
        ReportFactory.create_batch(5)

        reports = report_list(filters={"community__name": community.name})
        self.assertEqual(len(reports), 15)

    def test_report_filter_by_category(self):
        category = ReportCategoryFactory.create()
        ReportFactory.create_batch(7, category=category)
        ReportFactory.create_batch(3)

        reports = report_list(filters={"category": category})
        self.assertEqual(len(reports), 7)

    def test_report_filter_by_status(self):
        ReportFactory.create_batch(4, status=ReportStatus.PENDING)
        ReportFactory.create_batch(3, status=ReportStatus.RESOLVED)

        pending_reports = report_list(filters={"status": ReportStatus.PENDING})
        resolved_reports = report_list(filters={"status": ReportStatus.RESOLVED})

        self.assertEqual(len(pending_reports), 4)
        self.assertEqual(len(resolved_reports), 3)

    def test_report_filter_by_combined_conditions(self):
        user = BaseUserFactory.create()
        community = CommunityFactory.create()
        category = ReportCategoryFactory.create()

        ReportFactory.create_batch(
            5,
            reported_by=user,
            community=community,
            category=category,
            status=ReportStatus.PENDING,
        )
        ReportFactory.create_batch(10)

        reports = report_list(
            filters={
                "reported_by": user,
                "community__name": community.name,
                "category": category,
                "status": ReportStatus.PENDING,
            }
        )

        self.assertEqual(len(reports), 5)
