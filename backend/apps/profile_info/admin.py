from django.contrib import admin
from django import forms
from apps.profile_info.models import BaseUserProfile
from django.contrib import messages
from apps.users.models import BaseUser
from .forms import BaseUserForm 

@admin.register(BaseUserProfile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "first_name", "last_name", "is_active", "is_staff", "is_admin")
    search_fields = ("username", "email", "first_name", "last_name")
    list_filter = ("is_active", "is_staff", "is_admin")
    ordering = ("id",)

    fields = ("username", "email", "first_name", "last_name", "is_active", "is_staff", "is_admin")
    list_editable = ("first_name", "last_name", "username", "email", "is_active", "is_staff", "is_admin")

    def has_add_permission(self, request):
        return False  
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def save_model(self, request, obj, form, change):
        if " " in obj.username:
            messages.error(request, "Username cannot contain spaces")
            return  
        super().save_model(request, obj, form, change)
        
        

