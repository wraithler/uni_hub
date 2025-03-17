from importlib import import_module
from typing import TYPE_CHECKING, Sequence, Type

from django.conf import settings
from django.contrib import auth
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.authentication import BaseAuthentication, SessionAuthentication
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


def get_auth_header(headers):
    value = headers.get("Authorization")

    if not value:
        return None

    auth_type, auth_value = value.split()[:2]

    return auth_type, auth_value


class SessionAsHeaderAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = get_auth_header(request.headers)

        if auth_header is None:
            return None

        auth_type, auth_value = auth_header

        if auth_type != "Session":
            return None

        engine = import_module(settings.SESSION_STORE)
        SessionStore = engine.SessionStore
        session_key = auth_value

        request.session = SessionStore(session_key)
        user = auth.get_user(request)

        return user, None


class CsrfExemptedSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


if TYPE_CHECKING:
    from rest_framework.permissions import _PermissionClass, BasePermission

    PermissionClassesType = Sequence[_PermissionClass]
else:
    PermissionClassesType = Sequence[Type[BasePermission]]


class ApiAuthMixin:
    authentication_classes: Sequence[Type[BaseAuthentication]] = [
        CsrfExemptedSessionAuthentication,
        SessionAsHeaderAuthentication,
        JWTAuthentication,
    ]
    permission_classes: PermissionClassesType = (IsAuthenticated,)


class SearchMixin(ListAPIView):
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = []  # To be overridden in the child class

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get("search", None)

        if search_query and self.search_fields:
            query_filter = Q()

            for field in self.search_fields:
                query_filter |= Q(**{f"{field}__icontains": search_query})

            queryset = queryset.filter(query_filter)

        return queryset
