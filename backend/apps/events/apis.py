from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.events.models import EventTicket
from rest_framework import status

from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.events.models import Event
from apps.events.selectors import event_get, event_list
from apps.events.services import event_create, event_update
from apps.events.services import event_ticket_create


class EventDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        description = serializers.CharField()
        starts_at = serializers.DateTimeField()
        ends_at = serializers.DateTimeField()
        community = serializers.IntegerField()
        location = serializers.CharField()
        is_virtual_event = serializers.BooleanField()
        virtual_link = serializers.URLField()

    def get(self, request, event_id):
        event = event_get(event_id)

        if event_id is None:
            raise Http404

        data = self.OutputSerializer(event).data

        return Response(data)


class EventListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        name = serializers.CharField(required=False)
        description = serializers.CharField(required=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Event
            fields = (
                "id",
                "name",
                "description",
                "starts_at",
                "ends_at",
                "community",
                "location",
                "is_virtual_event",
                "virtual_link",
            )

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        events = event_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=events,
            request=request,
            view=self,
        )


class EventCreateApi(APIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()
        description = serializers.CharField()
        starts_at = serializers.DateTimeField()
        ends_at = serializers.DateTimeField()
        community = serializers.IntegerField()
        location = serializers.CharField()
        is_virtual_event = serializers.BooleanField()
        virtual_link = serializers.URLField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event = event_create(**serializer.validated_data, created_by=request.user)

        data = EventDetailApi.OutputSerializer(event).data

        return Response(data)


class EventUpdateApi(APIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()
        description = serializers.CharField()
        starts_at = serializers.DateTimeField()
        ends_at = serializers.DateTimeField()
        location = serializers.CharField()
        is_virtual_event = serializers.BooleanField()
        virtual_link = serializers.URLField()

    def patch(self, request, event_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event = event_get(event_id)

        if event is None:
            raise Http404

        event = event_update(event, **serializer.validated_data)

        data = EventDetailApi.OutputSerializer(event).data

        return Response(data)

class EventTicketCreateApi(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = EventTicket
            fields = ['id', 'ticket_id', 'qr_code', 'event', 'user']

    def post(self, request, event_id):
        user = request.user
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise Http404

        ticket = event_ticket_create(event=event, user=user)

        serializer = self.OutputSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
