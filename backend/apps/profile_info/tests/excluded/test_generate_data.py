from apps.profile_info.factories import BaseUserFactory

from unittest import TestCase 


class GenerateDataTests(TestCase):
    def test_generate_data(self):
        BaseUserFactory.create_batch(100)

