from django.contrib import admin
from apps.profile.models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'gender_display', 'hobbies_display', 'bio_preview')

    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'bio')
    
    list_filter = ('gender',)
    
    fieldsets = (
        ('User Link', {
            'fields': ('user',),
            'description': 'Connected user account'
        }),
        ('Personal Information', {
            'fields': ('gender', 'hobbies', 'bio'),
        }),
        ('Social Media', {
            'fields': ('website_url', 'github_url', 'linkedin_url'),
            'classes': ('collapse',),
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'
    user_email.admin_order_field = 'user__email'
    
    def gender_display(self, obj):
        return obj.get_gender_display()
    gender_display.short_description = 'Gender'
    
    def hobbies_display(self, obj):
        return obj.get_hobbies_display()
    hobbies_display.short_description = 'Hobbies'
    
    def bio_preview(self, obj):
        return obj.bio[:50] + '...' if obj.bio else ''
    bio_preview.short_description = 'Bio Preview'
    
    def has_add_permission(self, request):
        return True
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    