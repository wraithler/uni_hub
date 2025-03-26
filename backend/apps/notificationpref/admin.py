from django.contrib import admin
from apps.notificationpref.models import UserNotificationPreference
from apps.communities.models import Community
from apps.users.models import BaseUser

@admin.register(UserNotificationPreference)
class UserNotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = (
        "display_username",  
        "event_updates",
        "post_notifications",
        "announcements",
        "email_notifications",
        "in_app_notifications",
    )
    
    def display_username(self, obj):
        return obj.user.username  
    display_username.short_description = 'Username'


    search_fields = ("user__username",)


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
            queryset = queryset.filter(user__username__icontains=search_term)
        return queryset, may_have_duplicates

    def get_list_display(self, request):
        """Override to display the correct fields based on the admin's permissions."""
        if not request.user.is_superuser:
            return self.list_display  
        return self.list_display
    
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

    actions = ['disable_notifications', 'turn_on_notifications']

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

    def get_actions(self, request):
        actions = super().get_actions(request)
        

        if 'delete_selected' in actions:
            del actions['delete_selected']
        
        return actions


    def has_delete_permission(self, request, obj=None):
        return False
