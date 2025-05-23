from django.shortcuts import get_object_or_404
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import AuthAPIView
from apps.files.models import File
from apps.files.services import FileStandardUploadService, FileDirectUploadService


class FileStandardUploadApi(AuthAPIView):
    def post(self, request):
        service = FileStandardUploadService(
            user=request.user, _file=request.FILES["file"]
        )
        file = service.create()

        return Response(data={"id": file.id}, status=status.HTTP_201_CREATED)


class FileDirectUploadStartApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        file_name = serializers.CharField()
        file_type = serializers.CharField()

    def post(self, request, *args, **kwargs):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = FileDirectUploadService(request.user)
        presigned_data = service.start(**serializer.validated_data)

        return Response(data=presigned_data)


class FileDirectUploadLocalApi(AuthAPIView):
    def post(self, request, file_id):
        file = get_object_or_404(File, id=file_id)
        _file = request.FILES["file"]

        service = FileDirectUploadService(request.user)
        file = service.upload_local(file=file, _file=_file)

        return Response({"id": file.id})


class FileDirectUploadFinishApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        file_id = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_id = serializer.validated_data["file_id"]

        file = get_object_or_404(File, id=file_id)

        service = FileDirectUploadService(request.user)
        service.finish(file=file)

        return Response({"id": file.id})
