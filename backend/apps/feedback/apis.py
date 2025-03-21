from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.feedback.models import Feedback
from apps.feedback.selectors import feedback_get, feedback_list
from apps.feedback.services import feedback_create, feedback_update
from apps.users.apis import UserDetailApi


# TODO: Lock down to only admins and the user who created the feedback


class FeedbackDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        created_by = UserDetailApi.OutputSerializer()
        content = serializers.CharField()
        rating = serializers.IntegerField()
        is_anonymous = serializers.BooleanField()
        created_at = serializers.DateTimeField()
        updated_at = serializers.DateTimeField()

    def get(self, request, feedback_id):
        feedback = feedback_get(feedback_id)

        if feedback is None:
            raise Http404

        data = self.OutputSerializer(feedback).data

        return Response(data)


class FeedbackListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        rating = serializers.IntegerField(required=False)
        created_by = serializers.IntegerField(required=False)
        is_anonymous = serializers.BooleanField(required=False)

    class OutputSerializer(serializers.Serializer):
        class Meta:
            model = Feedback
            fields = ("id", "created_by", "rating", "is_anonymous")

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        feedback = feedback_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=feedback,
            request=request,
            view=self,
        )


class FeedbackCreateApi(APIView):
    class InputSerializer(serializers.Serializer):
        content = serializers.CharField()
        rating = serializers.IntegerField()
        is_anonymous = serializers.BooleanField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feedback = feedback_create(**serializer.validated_data)

        data = FeedbackDetailApi.OutputSerializer(feedback).data

        return Response(data)


class FeedbackUpdateApi(APIView):
    class InputSerializer(serializers.Serializer):
        content = serializers.CharField(required=False)
        rating = serializers.IntegerField(required=False)
        is_anonymous = serializers.BooleanField(required=False)

    # TODO: Ensure if is_anonymous is set to True, created_by is set to None and vice versa
    def post(self, request, feedback_id):
        feedback = feedback_get(feedback_id)

        if feedback is None:
            raise Http404

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feedback = feedback_update(feedback=feedback, data=serializer.validated_data)

        data = FeedbackDetailApi.OutputSerializer(feedback).data

        return Response(data)
