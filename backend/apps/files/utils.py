import pathlib
from uuid import uuid4

from django.conf import settings
from django.urls import reverse


def file_generate_name(filename):
    ext = pathlib.Path(filename).suffix
    return f"{uuid4().hex}{ext}"


def file_generate_upload_path(instance, filename):
    return f"files/{instance.file_name}"


def file_generate_local_upload_url(*, file_id: str):
    url = reverse("api:files:upload:direct:local", kwargs={"file_id": file_id})
    return f"{settings.APP_DOMAIN}{url}"


def bytes_to_mib(bytes_: int) -> float:
    return bytes_ * 9.5367431640625e-7
