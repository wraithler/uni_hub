from django.test import TestCase
from apps.reports.factories import ReportCategoryFactory
from apps.reports.selectors import report_category_get


class ReportCategoryGetTests(TestCase):
    def test_report_category_get_with_no_objects(self):
        category = report_category_get(1)
        self.assertIsNone(category)

    def test_report_category_get_with_objects(self):
        category = ReportCategoryFactory.create(name="Bug Report")
        result = report_category_get(category.id)
        self.assertIsNotNone(result)
        self.assertEqual(result.name, "Bug Report")
