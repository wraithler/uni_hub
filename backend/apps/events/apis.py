from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import AuthAPIView
from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.events.models import Event, EventTicket
from apps.events.selectors import event_get, event_list
from apps.events.services import (
    event_create,
    event_update,
    event_ticket_create,
    event_ticket_update,
)


class EventDetailApi(AuthAPIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        title = serializers.CharField()
        description = serializers.CharField()
        starts_at = serializers.DateTimeField()
        ends_at = serializers.DateTimeField()
        location = serializers.CharField()
        is_virtual_event = serializers.BooleanField()
        virtual_link = serializers.URLField()

        def to_representation(self, instance):
            user = self.context.get("request").user
            if instance.privacy == "members" or instance.community.privacy == "members":
                if not instance.community.memberships.filter(user=user).exists():
                    raise Http404
            return super().to_representation(instance)

    def get(self, request, event_id):
        event = event_get(event_id)

        if event is None:
            raise Http404

        data = self.OutputSerializer(event, context={"request": request}).data
        return Response(data)


class EventListApi(AuthAPIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        name = serializers.CharField(required=False)
        description = serializers.CharField(required=False)
        upcoming = serializers.BooleanField()
        past = serializers.BooleanField()

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Event
            fields = (
                "id",
                "title",
                "description",
                "starts_at",
                "ends_at",
                "community",
                "location",
                "is_virtual_event",
                "virtual_link",
                "attendees",
            )

        attendees = serializers.SerializerMethodField()

        def get_attendees(self, obj):
            return obj.attendees.all().count()

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        events = event_list(filters=filters_serializer.validated_data, request=request)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=events,
            request=request,
            view=self,
        )


@method_decorator(csrf_protect, name="dispatch")
class EventCreateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        title = serializers.CharField()
        description = serializers.CharField()
        starts_at = serializers.DateTimeField()
        ends_at = serializers.DateTimeField()
        community = serializers.IntegerField()
        location = serializers.CharField(required=False)
        is_virtual_event = serializers.BooleanField()
        virtual_link = serializers.URLField(required=False)
        privacy = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data.copy()

        if (
            "virtual_link" not in validated_data
            or validated_data["virtual_link"] is None
        ):
            validated_data["virtual_link"] = ""

        event = event_create(**validated_data, created_by=request.user)

        data = EventDetailApi.OutputSerializer(event, context={"request": request}).data
        return Response(data)


class EventUpdateApi(AuthAPIView):
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
        data = EventDetailApi.OutputSerializer(event, context={"request": request}).data
        return Response(data)


class EventTicketCreateApi(AuthAPIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = EventTicket
            fields = ["id", "ticket_id", "qr_code", "event", "user"]

    def post(self, request, event_id):
        user = request.user
        event = event_get(event_id)
        if event is None:
            raise Http404

        ticket = event_ticket_create(event=event, user=user)
        serializer = self.OutputSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventTicketUpdateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        used = serializers.BooleanField()

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = EventTicket
            fields = ["id", "ticket_id", "used", "event", "user", "qr_code"]

    def patch(self, request, ticket_id):
        try:
            ticket = EventTicket.objects.get(id=ticket_id)
        except EventTicket.DoesNotExist:
            raise Http404

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticket = event_ticket_update(
            ticket=ticket, used=serializer.validated_data["used"]
        )
        return Response(self.OutputSerializer(ticket).data)
