from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from apps.reports.models import ReportCategory, Report, ReportAttachment
from apps.reports.services import report_category_create, report_create


@admin.register(ReportCategory)
class ReportCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "is_active")
    search_fields = ("name",)
    list_filter = ("is_active",)
    fieldsets = ((None, {"fields": ("name", "description", "is_active")}),)
    readonly_fields = ("created_at", "updated_at")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)
        try:
            report_category_create(**form.cleaned_data)
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "status",
        "reported_by",
        "reported_user",
        "category",
        "community",
    )
    search_fields = ("title", "description")
    list_filter = ("status", "category", "community")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "description",
                    "status",
                    "category",
                    "reported_user",
                    "community",
                )
            },
        ),
        ("Additional Info", {"fields": ("evidence_links", "resolution_notes")}),
    )
    readonly_fields = ("created_at", "updated_at", "reported_by", "reviewed_by")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)

        form.cleaned_data["reported_by"] = request.user

        try:
            report_create(**form.cleaned_data)
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)


@admin.register(ReportAttachment)
class ReportAttachmentAdmin(admin.ModelAdmin):
    list_display = ("report", "description", "file")
    search_fields = ("description",)
    list_filter = ("report",)
    readonly_fields = ("created_at", "updated_at")

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
