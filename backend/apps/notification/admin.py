from django.contrib import admin, messages
from django.contrib.auth.models import User

class NotificationAdmin(admin.ModelAdmin):
    

    list_display = ("id", "user", "message", "created_at")
    
    
    search_fields = ("message", "user__username")

    
    list_filter = ("created_at",)

    
    fieldsets = (
        (None, {"fields": ("message", "user", "created_at")}),
    )
    readonly_fields = ("created_at",)

    def save_model(self, request, obj, form, change):
     
        super().save_model(request, obj, form, change)

        if change:
            self.send_notification(request, "Your changes have been saved successfully.", messages.SUCCESS)
        else:
            self.send_notification(request, "A new object has been created.", messages.SUCCESS)

    def send_notification(self, request, message, level):
     
        self.message_user(request, message, level)

       
        print(f"Notification sent: {message}")

admin.site.register(User, NotificationAdmin)  
