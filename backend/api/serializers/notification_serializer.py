from rest_framework import serializers
from api.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['notification_id','notification_type', 'user', 'message', 'is_read', 'created_at']

    def create(self, validated_data):
        # when user reads the notification
        if validated_data.get('is_read', False):
            pass
        return super().create(validated_data)

    def delete(self, instance):
        instance.delete()
        return instance