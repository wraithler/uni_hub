from django.test import TestCase
from apps.reports.services import report_category_create
from apps.reports.models import ReportCategory


class ReportCategoryCreateTests(TestCase):
    def test_report_category_create_success(self):
        category = report_category_create(
            name="Bug Report", description="Reports bugs in the system"
        )
        self.assertIsInstance(category, ReportCategory)
        self.assertEqual(category.name, "Bug Report")
        self.assertTrue(category.is_active)
