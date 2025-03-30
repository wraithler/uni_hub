from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from django.http import Http404

from apps.friends.models import FriendRequest
from apps.friends.services import (
    friend_request_send,
    friend_request_accept,
    friend_request_decline
)
from apps.friends.selectors import get_received_friend_requests


class FriendRequestSendApi(APIView):
    class InputSerializer(serializers.Serializer):
        receiver_id = serializers.IntegerField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        friend_request = friend_request_send(
            sender=request.user,
            receiver_id=serializer.validated_data["receiver_id"]
        )

        return Response({"id": friend_request.id, "status": "sent"})


class FriendRequestListApi(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = FriendRequest
            fields = ("id", "sender", "receiver", "is_accepted", "is_declined", "created_at")

    def get(self, request):
        friend_requests = get_received_friend_requests(user_id=request.user.id)

        data = self.OutputSerializer(friend_requests, many=True).data
        return Response(data)


class FriendRequestRespondApi(APIView):
    class InputSerializer(serializers.Serializer):
        is_accepted = serializers.BooleanField()

    def post(self, request, request_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            friend_request = FriendRequest.objects.get(id=request_id, receiver=request.user)
        except FriendRequest.DoesNotExist:
            raise Http404

        if serializer.validated_data["is_accepted"]:
            friend_request_accept(request=friend_request)
            return Response({"status": "accepted"})
        else:
            friend_request_decline(request=friend_request)
            return Response({"status": "declined"})
