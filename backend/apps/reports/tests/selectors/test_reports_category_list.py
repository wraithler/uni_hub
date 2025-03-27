from django.test import TestCase
from apps.reports.factories import ReportCategoryFactory
from apps.reports.selectors import report_category_list


class ReportCategoryListTests(TestCase):
    def test_report_category_list_without_filters(self):
        ReportCategoryFactory.create_batch(4)
        categories = report_category_list(filters={})
        self.assertEqual(categories.count(), 4)

    def test_report_category_list_with_filters(self):
        ReportCategoryFactory.create(name="Bug")
        ReportCategoryFactory.create(name="Feature Request")

        categories = report_category_list(filters={"name": "Bug"})
        self.assertEqual(categories.count(), 1)
        self.assertEqual(categories.first().name, "Bug")
