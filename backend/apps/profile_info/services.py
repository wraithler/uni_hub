from django.core.exceptions import ValidationError
from apps.users.models import BaseUser


def update_user_profile(user, validated_data):
  
    try:
        if 'username' in validated_data:
            user.username = validated_data['username']
        if 'email' in validated_data:
            user.email = validated_data['email']
        if 'first_name' in validated_data:
            user.first_name = validated_data['first_name']
        if 'last_name' in validated_data:
            user.last_name = validated_data['last_name']

        if 'is_active' in validated_data:
            user.is_active = validated_data['is_active']
        if 'is_staff' in validated_data:
            user.is_staff = validated_data['is_staff']
        if 'is_admin' in validated_data:
            user.is_admin = validated_data['is_admin']

        user.save()

    except Exception as e:
        raise ValidationError(f"An error occurred while updating the profile: {str(e)}")

def get_user_profile(user_id):

    try:
        user = BaseUser.objects.get(id=user_id)
        return user
    except BaseUser.DoesNotExist:
        raise ValidationError("User not found.")