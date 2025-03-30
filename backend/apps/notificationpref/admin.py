from django.contrib import admin
from apps.notificationpref.models import UserNotificationPreference


@admin.register(UserNotificationPreference)
class UserNotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = (
        "user_email_display",  
        "event_updates",
        "post_notifications",
        "announcements",
        "email_notifications",
        "in_app_notifications",
    )
    
    def user_email_display(self, obj):
        return obj.user.email  
    user_email_display.short_description = 'User Email' 

    search_fields = ("user__email",)  

    list_filter = (
        "event_updates",
        "post_notifications",
        "announcements",
        "email_notifications",
        "in_app_notifications"
    )

    fieldsets = (
        (None, {"fields": ("user", "subscribed_communities")}),
        ("Notification Preferences", {
            "fields": (
                "event_updates",
                "post_notifications",
                "announcements",
                "email_notifications",
                "in_app_notifications",
            )
        }),
    )

    autocomplete_fields = ("user",)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.user = request.user
        super().save_model(request, obj, form, change)

    filter_horizontal = ("subscribed_communities",)

    def get_search_results(self, request, queryset, search_term):
        queryset, may_have_duplicates = super().get_search_results(request, queryset, search_term)
        if search_term:
            queryset = queryset.filter(user__email__icontains=search_term)  
        return queryset, may_have_duplicates

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        field = super().formfield_for_manytomany(db_field, request, **kwargs)
        if db_field.name == "subscribed_communities":
            field.help_text = ""
        return field
    
    def disable_notifications(self, request, queryset):
        queryset.update(
            event_updates=False,
            post_notifications=False,
            announcements=False,
            email_notifications=False,
            in_app_notifications=False
        )
        self.message_user(request, "Selected users' notifications have been disabled.")
    disable_notifications.short_description = "Disable notifications for selected users"

    def turn_on_notifications(self, request, queryset):
        queryset.update(
            event_updates=True,
            post_notifications=True,
            announcements=True,
            email_notifications=True,
            in_app_notifications=True
        )
        self.message_user(request, "Selected users' notifications have been enabled.")
    turn_on_notifications.short_description = "Turn on notifications for selected users"

    actions = ['disable_notifications', 'turn_on_notifications']

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def has_delete_permission(self, request, obj=None):
        return False