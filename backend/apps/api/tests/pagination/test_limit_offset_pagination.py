from collections import OrderedDict

from django.test import TestCase
from rest_framework.test import APIRequestFactory

from apps.communities.apis import CommunityListApi
from apps.communities.factories import CommunityFactory


class GetPaginatedResponseTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.communities = CommunityFactory.create_batch(10)

    def test_response_is_paginated_correctly(self):
        first_page_request = self.factory.get("/api/communities")
        first_page_response = CommunityListApi.as_view()(first_page_request)

        expected_response = OrderedDict(
            [
                ("limit", 1),
                ("offset", 0),
                ("count", 10),
                ("next", "http://testserver/api/communities?limit=1&offset=1"),
                ("previous", None),
                (
                    "results",
                    [
                        {
                            "id": self.communities[0].id,
                            "name": self.communities[0].name,
                            "description": self.communities[0].description,
                            "emoji": self.communities[0].emoji,
                            "is_private": self.communities[0].is_private,
                        }
                    ],
                ),
            ]
        )

        self.assertEqual(first_page_response.data, expected_response)

        ten_item_request = self.factory.get("/api/communities", {"limit": 10})
        ten_item_response = CommunityListApi.as_view()(ten_item_request)

        expected_response = OrderedDict(
            [
                ("limit", 10),
                ("offset", 0),
                ("count", 10),
                ("next", None),
                ("previous", None),
                (
                    "results",
                    [
                        {
                            "id": community.id,
                            "name": community.name,
                            "description": community.description,
                            "emoji": community.emoji,
                            "is_private": community.is_private,
                        }
                        for community in self.communities
                    ],
                ),
            ]
        )

        self.assertEqual(ten_item_response.data, expected_response)
