from apps.users.models import BaseUser

class BaseUserProfile(BaseUser):
    class Meta:
        proxy = True  
        verbose_name = "Base User Profile"
        verbose_name_plural = "Base User Profiles"