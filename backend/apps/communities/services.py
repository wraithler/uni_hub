from typing import List

from django.db import transaction

from apps.common.services import model_update
from apps.communities.models import CommunityCategory, Community


@transaction.atomic
def community_category_create(*, name: str, description: str) -> CommunityCategory:
    category = CommunityCategory.objects.create(name=name, description=description)

    return category


@transaction.atomic
def community_category_update(
    *, community_category: CommunityCategory, data
) -> CommunityCategory:
    non_side_effect_fields: List[str] = []

    community_category, has_updated = model_update(
        instance=community_category, fields=non_side_effect_fields, data=data
    )

    return community_category

@transaction.atomic
def community_create(*, name: str, description: str, category: CommunityCategory) -> Community:
    community = Community.objects.create(name=name, description=description, category=category)

    return community

@transaction.atomic
def community_update(*, community: Community, data) -> Community:
    non_side_effect_fields: List[str] = []

    community, has_updated = model_update(
        instance=community, fields=non_side_effect_fields, data=data
    )

    return community