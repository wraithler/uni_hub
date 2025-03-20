import mimetypes
from typing import Tuple, Any, Dict

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.files.models import File
from apps.files.utils import (
    bytes_to_mib,
    file_generate_name,
    file_generate_upload_path,
    file_generate_local_upload_url,
)
from apps.integrations.aws.client import s3_generate_presigned_post
from apps.users.models import BaseUser


def _validate_file_size(_file):
    if _file.size > settings.FILE_MAX_SIZE:
        raise ValidationError(
            f"File size is too large. Max file size is {bytes_to_mib(settings.FILE_MAX_SIZE)} MiB."
        )


class FileStandardUploadService:
    def __init__(self, user: BaseUser, _file):
        self.user = user
        self._file = _file

    def _infer_file_name_and_type(
        self, file_name: str = "", file_type: str = ""
    ) -> Tuple[str, str]:
        if not file_name:
            file_name = self._file.name

        if not file_type:
            guessed_file_type, encoding = mimetypes.guess_type(file_name)

            file_type = guessed_file_type or ""

        return file_name, file_type

    @transaction.atomic
    def create(self, file_name: str = "", file_type: str = "") -> File:
        _validate_file_size(self._file)

        file_name, file_type = self._infer_file_name_and_type(file_name, file_type)

        file = File(
            file=self._file,
            original_file_name=file_name,
            file_name=file_name,
            file_type=file_type,
            uploaded_by=self.user,
            upload_finished_at=timezone.now(),
        )

        file.full_clean()
        file.save()

        return file

    @transaction.atomic
    def update(self, file: File, file_name: str = "", file_type: str = "") -> File:
        _validate_file_size(self._file)

        file_name, file_type = self._infer_file_name_and_type(file_name, file_type)

        file.file = self._file
        file.original_file_name = file_name
        file.file_name = file_generate_name(file_name)
        file.file_type = file_type
        file.uploaded_by = self.user
        file.upload_finished_at = timezone.now()

        file.full_clean()
        file.save()

        return file


class FileDirectUploadService:
    def __init__(self, user: BaseUser):
        self.user = user

    @transaction.atomic
    def start(self, *, file_name: str, file_type: str) -> Dict[str, Any]:
        file = File(
            original_file_name=file_name,
            file_name=file_generate_name(file_name),
            file_type=file_type,
            uploaded_by=self.user,
            file=None,
        )
        file.full_clean()
        file.save()

        upload_path = file_generate_upload_path(file, file.file_name)

        file.file = file.file.field.attr_class(
            file, file.file.field, upload_path
        )  # associate file with FileField
        file.save()

        presigned_data: Dict[str, Any] = {}

        if settings.USE_S3:
            presigned_data = s3_generate_presigned_post(
                file_path=upload_path, file_type=file.file_type
            )
        else:
            presigned_data = {
                "url": file_generate_local_upload_url(file_id=str(file.id))
            }

        return {"id": file.id, **presigned_data}

    @transaction.atomic
    def finish(self, *, file: File) -> File:
        file.upload_finished_at = timezone.now()
        file.full_clean()
        file.save()

        return file

    @transaction.atomic
    def upload_local(self, *, file: File, _file) -> File:
        _validate_file_size(_file)

        # Check against user

        file.file = _file
        file.full_clean()
        file.save()

        return file
