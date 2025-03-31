from django.test import TestCase
from apps.reports.factories import ReportCategoryFactory
from apps.reports.services import report_category_update


class ReportCategoryUpdateTests(TestCase):
    def test_report_category_update_success(self):
        category = ReportCategoryFactory.create(
            name="Bug Report", description="Reports bugs", is_active=True
        )
        updated_category = report_category_update(
            report_category=category,
            data={
                "name": "Feature Request",
                "description": "Requesting new features",
                "is_active": False,
            },
        )
        self.assertEqual(updated_category.name, "Feature Request")
        self.assertEqual(updated_category.description, "Requesting new features")
        self.assertFalse(updated_category.is_active)
