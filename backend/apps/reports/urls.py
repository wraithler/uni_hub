from django.urls import path

from apps.reports.apis import (
    ReportDetailApi,
    ReportCreateApi,
    ReportListApi,
    ReportUpdateApi,
    ReportResolveApi,
    ReportAttachmentUploadApi,
)

urlpatterns = [
    path("", ReportListApi.as_view(), name="list"),
    path("create/", ReportCreateApi.as_view(), name="create"),
    path("<int:report_id>/", ReportDetailApi.as_view(), name="detail"),
    path("<int:report_id>/update/", ReportUpdateApi.as_view(), name="update"),
    path("<int:report_id>/resolve/", ReportResolveApi.as_view(), name="resolve"),
    path(
        "attachments/upload/",
        ReportAttachmentUploadApi.as_view(),
        name="attachment_upload",
    ),
]