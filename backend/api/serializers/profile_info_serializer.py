from rest_framework import serializers
from api.models import User
from django.core.exceptions import ValidationError

class ProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "name", 
            "username",  
            "email", 
            "bio", 
            "academic_department", 
            "year_of_study",
            "created_at",
        ]
        read_only_fields = ["created_at"]

