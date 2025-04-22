from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from apps.posts.models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("community", "created_by", "created_at")
    search_fields = ("content",)
    list_filter = ("community", "created_by")
    fieldsets = ((None, {"fields": ("content", "community", "created_by")}),)
    readonly_fields = ("created_at", "updated_at")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)

        try:
            obj.created_by = request.user
            obj.save()
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)

    def delete_model(self, request, obj):
        try:
            obj.delete()
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)
