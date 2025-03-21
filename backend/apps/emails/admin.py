from django.contrib import admin

from apps.emails.models import Email
from apps.emails.services import email_send_all


@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ("id", "subject", "to", "status", "sent_at")
    actions = ["send_email"]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.defer("html", "plain_text")

    @admin.action(description="Send email")
    def send_email(self, request, queryset):
        email_send_all(queryset)
