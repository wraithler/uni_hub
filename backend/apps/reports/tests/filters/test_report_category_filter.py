from django.test import TestCase
from apps.reports.factories import ReportCategoryFactory
from apps.reports.selectors import report_category_list

class ReportCategoryFilterTests(TestCase):
    def test_filter_by_is_active(self):
        # Create active and inactive categories
        ReportCategoryFactory.create_batch(3, is_active=True)
        ReportCategoryFactory.create_batch(2, is_active=False)
        
        # Filter active categories
        active_categories = report_category_list(filters={"is_active": True})
        self.assertEqual(len(active_categories), 3)
        
        # Filter inactive categories
        inactive_categories = report_category_list(filters={"is_active": False})
        self.assertEqual(len(inactive_categories), 2)

    def test_filter_by_name(self):
        # Create categories with different names
        ReportCategoryFactory.create(name="Bug Report")
        ReportCategoryFactory.create(name="Feature Request")
        ReportCategoryFactory.create(name="Other")
        
        # Filter by name
        categories = report_category_list(filters={"name": "Bug Report"})
        self.assertEqual(len(categories), 1)
        self.assertEqual(categories[0].name, "Bug Report")