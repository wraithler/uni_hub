from rest_framework import serializers
from api.models import Post, Comment

class CommentSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Comment
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer()  

    class Meta:
        model = Post
        fields = "__all__"
