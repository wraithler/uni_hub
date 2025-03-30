from django.apps import AppConfig

class ProfileConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.profile"
    verbose_name = "Profile Management"  # This names your admin section