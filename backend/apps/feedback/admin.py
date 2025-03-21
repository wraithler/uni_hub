from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from apps.communities.services import community_create
from apps.feedback.models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("created_by", "content", "rating", "is_anonymous")

    search_fields = ("content",)

    list_filter = ("rating",)

    fieldsets = (
        (None, {"fields": ("content", "rating", "is_anonymous")}),
    )

    readonly_fields = ("created_at", "updated_at", "created_by")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)

        form.cleaned_data["created_by"] = request.user

        try:
            community_create(**form.cleaned_data)
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)