# apps/profile_info/selectors.py

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from apps.users.models import BaseUser
from apps.profile_info.models import BaseUserProfile

def get_user_profile(user_id):

    try:
        # Since BaseUserProfile is a proxy model, we can query BaseUser directly
        profile = BaseUser.objects.get(id=user_id)
        return profile
    except BaseUser.DoesNotExist:
        raise ValidationError("User with this ID does not exist.")

def get_user_by_username(username):
    try:
        user = BaseUser.objects.get(username=username)
    except ObjectDoesNotExist:
        raise ValidationError("User not found.")
    return user

def get_all_user_profiles():
    return BaseUserProfile.objects.all()

def get_user_profile_for_edit(user_id):
    try:
        profile = BaseUserProfile.objects.get(id=user_id)  # Directly query proxy model
    except ObjectDoesNotExist:
        raise ValidationError("Profile not found.")
    return profile