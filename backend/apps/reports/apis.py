from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import AuthAPIView
from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.reports.models import Report, ReportStatus
from apps.reports.selectors import report_get, report_list
from apps.reports.services import (
    report_create,
    report_update,
    report_resolve,
    report_attachment_create,
)


class ReportDetailApi(AuthAPIView):
    class OutputSerializer(serializers.ModelSerializer):
        status = serializers.ChoiceField(choices=ReportStatus.choices)

        class Meta:
            model = Report
            fields = (
                "id",
                "title",
                "description",
                "status",
                "category",
                "reported_by",
                "reported_user",
                "community",
                "evidence_links",
                "resolution_notes",
            )

    def get(self, request, report_id):
        report = report_get(report_id)

        if report is None:
            raise Http404

        data = self.OutputSerializer(report).data

        return Response(data)


class ReportListApi(AuthAPIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 10

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        status = serializers.ChoiceField(choices=ReportStatus.choices, required=False)
        reported_by = serializers.IntegerField(required=False)
        reported_user = serializers.IntegerField(required=False)
        community = serializers.IntegerField(required=False)
        is_my_report = serializers.BooleanField(required=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Report
            fields = (
                "id",
                "title",
                "status",
                "reported_by",
                "reported_user",
                "community",
            )

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        validated_data = filters_serializer.validated_data
        if validated_data.get("is_my_report"):
            validated_data["reported_by"] = request.user.id
            validated_data.pop("is_my_report", None)

        reports = report_list(filters=validated_data, request=request)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=reports,
            request=request,
            view=self,
        )


class ReportCreateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        title = serializers.CharField()
        description = serializers.CharField()
        category = serializers.IntegerField()
        reported_user = serializers.IntegerField(required=False, allow_null=True)
        community = serializers.IntegerField(required=False, allow_null=True)
        evidence_links = serializers.JSONField(required=False, allow_null=True)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        validated_data["reported_by"] = request.user

        report = report_create(**validated_data)

        data = ReportDetailApi.OutputSerializer(report).data

        return Response(data)


class ReportUpdateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        title = serializers.CharField(required=False)
        description = serializers.CharField(required=False)
        evidence_links = serializers.JSONField(required=False)

    def post(self, request, report_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        report = report_get(report_id)

        if report is None:
            raise Http404

        report = report_update(report, **serializer.validated_data)

        data = ReportDetailApi.OutputSerializer(report).data

        return Response(data)


class ReportResolveApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        status = serializers.ChoiceField(choices=ReportStatus.choices)
        resolution_notes = serializers.CharField(required=False, allow_null=True)

    def post(self, request, report_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        report = report_get(report_id)

        if report is None:
            raise Http404

        report = report_resolve(
            report=report, resolved_by=request.user, **serializer.validated_data
        )

        data = ReportDetailApi.OutputSerializer(report).data

        return Response(data)


class ReportAttachmentUploadApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        report = serializers.IntegerField()
        file = serializers.FileField()
        description = serializers.CharField(required=False, allow_null=True)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        report = report_get(serializer.validated_data["report"])
        if report is None:
            raise Http404

        attachment = report_attachment_create(
            report=report,
            file=serializer.validated_data["file"],
            description=serializer.validated_data.get("description"),
        )

        return Response(
            {
                "id": attachment.id,
                "file": attachment.file.url,
                "description": attachment.description,
            }
        )
