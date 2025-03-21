from django.test import TestCase

from apps.communities.factories import CommunityFactory, CommunityInvitationFactory
from apps.communities.services import community_join
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory


class CommunityJoinTests(TestCase):
    def test_public_community_join(self):
        community = CommunityFactory.create(is_private=False)
        user = BaseUserFactory.create()

        community_join_result = community_join(community=community, user=user)

        self.assertTrue(community_join_result)

    def test_public_community_join_when_already_member(self):
        community = CommunityFactory.create(is_private=False)
        user = community.created_by

        with self.assertRaises(ApplicationError):
            community_join(community=community, user=user)

    def test_private_community_join(self):
        community = CommunityFactory.create(is_private=True)
        user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            community_join(community=community, user=user)

    def test_private_community_join_when_already_member(self):
        community = CommunityFactory.create(is_private=True)
        user = community.created_by

        with self.assertRaises(ApplicationError):
            community_join(community=community, user=user)

    def test_private_community_join_with_invitation(self):
        invitation = CommunityInvitationFactory.create()
        community = invitation.community
        user = invitation.user

        community_join_result = community_join(community=community, user=user)

        self.assertTrue(community_join_result)
