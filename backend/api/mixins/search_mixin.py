from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView


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
