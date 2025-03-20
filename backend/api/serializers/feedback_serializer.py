from rest_framework import serializers
from api.models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['feedback_id', 'user', 'content', 'rating', 'is_anonymous', 'created_at']

    def create(self, validated_data):
        if validated_data.get('is_anonymous', True):
            validated_data['user'] = None  
        return super().create(validated_data)

    def delete(self, instance):
        instance.delete()
        return instance

