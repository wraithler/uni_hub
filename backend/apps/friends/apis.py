from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404

from apps.users.models import BaseUser
from apps.friends.models import FriendRequest, Friend
from apps.friends.selectors import (
    get_received_friend_requests,
    get_user_friends,
)
from apps.friends.services import (
    send_friend_request,
    accept_friend_request,
    unfriend_users,
)


class FriendRequestSendApi(APIView):
    class InputSerializer(serializers.Serializer):
        receiver_id = serializers.IntegerField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        sender = request.user
        receiver_id = serializer.validated_data["receiver_id"]

        if sender.id == receiver_id:
            return Response({"detail": "You cannot add yourself as a friend."}, status=400)

        try:
            receiver = BaseUser.objects.get(id=receiver_id)
        except BaseUser.DoesNotExist:
            raise Http404("User not found.")

        result = send_friend_request(sender, receiver)

        return Response({"status": result}, status=200)


class ReceivedFriendRequestsListApi(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        sender_name = serializers.SerializerMethodField()
        sender = serializers.SerializerMethodField() 

        class Meta:
            model = FriendRequest
            fields = ("id", "sender", "sender_name")

        def get_sender_name(self, obj):
            return f"{obj.sender.first_name} {obj.sender.last_name}"
        
        def get_sender(self, obj):
            return {"id": obj.sender.id, "first_name": obj.sender.first_name, "last_name": obj.sender.last_name,}

    def get(self, request):
        requests = get_received_friend_requests(request.user)
        data = self.OutputSerializer(requests, many=True).data
        return Response(data)


class AcceptFriendRequestApi(APIView):
    class InputSerializer(serializers.Serializer):
        request_id = serializers.IntegerField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        request_id = serializer.validated_data["request_id"]
        success = accept_friend_request(request.user, request_id)

        if not success:
            return Response({"detail": "Invalid or unauthorized request."}, status=400)

        return Response({"detail": "Friend request accepted."}, status=200)


class UnfriendApi(APIView):
    class InputSerializer(serializers.Serializer):
        friend_id = serializers.IntegerField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        friend_id = serializer.validated_data["friend_id"]
        success = unfriend_users(request.user.id, friend_id)

        if not success:
            return Response({"detail": "Friend not found."}, status=404)

        return Response({"detail": "Unfriended successfully."}, status=200)


class FriendListApi(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        full_name = serializers.SerializerMethodField()

        class Meta:
            model = BaseUser
            fields = ("id", "full_name")

        def get_full_name(self, obj):
            return f"{obj.first_name} {obj.last_name}"

    def get(self, request):
        friends = get_user_friends(request.user)
        data = self.OutputSerializer(friends, many=True).data
        return Response(data)
