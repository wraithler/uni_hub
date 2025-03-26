from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from apps.communities.models import CommunityTags, Community
from apps.communities.services import community_category_create, community_create


@admin.register(CommunityTags)
class CommunityCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)

    search_fields = ("name",)

    list_filter = ()

    fieldsets = ((None, {"fields": ("name", )}),)

    readonly_fields = ("created_at", "updated_at")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)

        try:
            community_category_create(**form.cleaned_data)
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ("name", "description")

    search_fields = ("name", "description")

    fieldsets = ((None, {"fields": ("name", "description")}),)

    readonly_fields = ("created_at", "updated_at", "created_by")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)

        form.cleaned_data["created_by"] = request.user

        try:
            community_create(**form.cleaned_data)
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)
