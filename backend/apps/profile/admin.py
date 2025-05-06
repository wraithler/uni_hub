from django.contrib import admin
from apps.profile.models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user_email", "gender_display", "student_number", "hobbies_display", "course", "year_of_study", "phone_number")

    search_fields = ("user__email", "user__first_name", "user__last_name")

    list_filter = ("gender", "course", "year_of_study")

    fieldsets = (
        ("User Link", {"fields": ("user",), "description": "Connected user account"}),
        (
            "Personal Information",
            {
                "fields": ("gender", "student_number", "year_of_study", "course", "hobbies", "phone_number",),
            },
        ),
        (
            "Social Media",
            {
                "fields": ("website_url", "github_url", "linkedin_url"),
                "classes": ("collapse",),
            },
        ),
    )

    def user_email(self, obj):
        return obj.user.email

    user_email.short_description = "Email"
    user_email.admin_order_field = "user__email"

    def gender_display(self, obj):
        return obj.get_gender_display()

    gender_display.short_description = "Gender"

    def hobbies_display(self, obj):
        return obj.get_hobbies_display()

    hobbies_display.short_description = "Hobbies"

    def course_display(self, obj):
        return obj.get_course_display()
    course_display.short_description = "Course"

    def year_of_study_display(self, obj):
        return obj.get_year_of_study_display()
    year_of_study_display.short_description = "Year"

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return False
