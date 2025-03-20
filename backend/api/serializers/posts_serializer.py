from rest_framework import serializers
from api.models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
    
    def validate(self, data):
        if not data.get("title"):
            raise serializers.ValidationError("Title is required.")
        if not data.get("content"):
            raise serializers.ValidationError("Content cannot be empty.")
        return data
