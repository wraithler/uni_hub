from unittest import skip, TestCase  # noqa

from apps.communities.models import Community
from apps.events.factories import EventFactory
from apps.posts.factories import PostFactory
from apps.communities.services import (
    community_create,
    community_tag_create,
    community_category_create,
)
from apps.users.models import BaseUser


# @skip("Only for development purposes")
class GenerateDataTests(TestCase):
    def test_generate_data(self):
        for i in range(100):
            if i % 5 != 0:
                PostFactory.create(community=Community.objects.first())
            else:
                EventFactory.create(community=Community.objects.first())


#         community_create(
#             name="Computer Science Society",
#             description="A community for computer science enthusiasts",
#             tags=[
#                 community_tag_create(name="Programming"),
#                 community_tag_create(name="Technology"),
#                 community_tag_create(name="Research"),
#             ],
#             created_by=BaseUser.objects.first(),
#             category=community_category_create(name="Academic"),
#         )

#         community_create(
#             name="Environmental Action",
#             description="Working together to promote sustainability on campus",
#             tags=[
#                 community_tag_create(name="Sustainability"),
#                 community_tag_create(name="Activism"),
#                 community_tag_create(name="Environment"),
#             ],
#             created_by=BaseUser.objects.first(),
#             category=community_category_create(name="Cultural"),
#         )

#         community_create(
#             name="Campus Music Collective",
#             description="A community for musicians and music lovers",
#             tags=[
#                 community_tag_create(name="Music"),
#                 community_tag_create(name="Performance"),
#                 community_tag_create(name="Collaboration"),
#             ],
#             created_by=BaseUser.objects.first(),
#             category=community_category_create(name="Interest"),
#         )
