from rest_framework import serializers
from api.models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'content', 'created_at', 'updated_at']
        extra_kwargs = {
            'user': {'required': False}  
        }
    
    def create(self, validated_data):
        user = self.context['request'].user  
        validated_data['user'] = user  
        return super().create(validated_data)