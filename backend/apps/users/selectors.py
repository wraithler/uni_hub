from typing import Optional

from django.db.models import QuerySet

from apps.common.utils import get_object
from apps.users.filters import BaseUserFilter
from apps.users.models import BaseUser


def user_get_login_data(*, user: BaseUser):
    return {
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active,
        "is_admin": user.is_admin,
        "is_superuser": user.is_superuser,
        "first_name": user.first_name,
        "last_name": user.last_name,
        # "profile_picture": user.profile_picture,
    }


def user_get(user_id) -> Optional[BaseUser]:
    user = get_object(BaseUser, id=user_id)

    return user


def user_list(*, filters=None) -> QuerySet[BaseUser]:
    filters = filters or {}

    qs = BaseUser.objects.all()

    return BaseUserFilter(filters, qs).qs
