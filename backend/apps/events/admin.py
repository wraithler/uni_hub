from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from apps.events.models import Event, EventTicket


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "description",
        "starts_at",
        "ends_at",
        "location",
        "community",
        "is_virtual_event",
        "virtual_link",
    )

    search_fields = ("title", "description", "location")

    list_filter = ("community", "is_virtual_event")

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "description",
                    "starts_at",
                    "ends_at",
                    "location",
                    "community",
                )
            },
        ),
        ("Virtual Event", {"fields": ("is_virtual_event", "virtual_link")}),
    )

    readonly_fields = ("created_at", "updated_at", "created_by")

    def save_model(self, request, obj, form, change):
        if change:
            return super().save_model(request, obj, form, change)

        form.cleaned_data["created_by"] = request.user

        try:
            obj.save()
        except ValidationError as exc:
            self.message_user(request, str(exc), messages.ERROR)

@admin.register(EventTicket)
class EventTicketAdmin(admin.ModelAdmin):
    list_display = ("event", "user", "ticket_id", "created_at")
    search_fields = ("user__username", "event__title", "ticket_id")
    readonly_fields = ("ticket_id", "qr_code", "created_at", "updated_at")