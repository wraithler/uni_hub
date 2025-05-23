from django.conf import settings
from django.db import models

from apps.common.models import BaseModel
from apps.files.utils import file_generate_upload_path


class File(BaseModel):
    file = models.FileField(upload_to=file_generate_upload_path, blank=True, null=True)

    original_file_name = models.TextField()

    file_name = models.CharField(max_length=255, unique=True)
    file_type = models.CharField(max_length=255)

    uploaded_by = models.ForeignKey(
        "users.BaseUser", null=True, on_delete=models.SET_NULL
    )

    upload_finished_at = models.DateTimeField(blank=True, null=True)

    @property
    def is_valid(self):
        return bool(self.upload_finished_at)

    @property
    def url(self):
        if settings.USE_S3:
            return self.file.url

        return f"{settings.APP_DOMAIN}/media/{self.file_name}"
