from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.notifications.models import Notification 
from apps.notifications.selectors import notification_get, notification_list
from apps.notifications.services import notification_create, notification_update
from apps.users.apis import UserDetailApi



class NotificationPermission(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        
        return request.user == obj.user or request.user.is_staff



class NotificationDetailApi(APIView):
    permission_classes = [NotificationPermission] 

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        user = UserDetailApi.OutputSerializer()
        title = serializers.CharField()
        message = serializers.CharField()
        is_read = serializers.BooleanField()
        created_at = serializers.DateTimeField()
        updated_at = serializers.DateTimeField()

    def get(self, request, notification_id):
        notification = notification_get(notification_id)

        if notification is None:
            raise Http404

        data = self.OutputSerializer(notification).data
        return Response(data)



class NotificationListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 10  

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        user = serializers.IntegerField(required=False)
        is_read = serializers.BooleanField(required=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Notification
            fields = ("id", "user", "title", "is_read", "created_at")

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        notifications = notification_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=notifications,
            request=request,
            view=self,
        )



class NotificationCreateApi(APIView):
    permission_classes = [IsAuthenticated]  

    class InputSerializer(serializers.Serializer):
        title = serializers.CharField()
        message = serializers.CharField()
        is_read = serializers.BooleanField(required=False, default=False)  

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        
        notification = notification_create(**serializer.validated_data, user=request.user)

        data = NotificationDetailApi.OutputSerializer(notification).data
        return Response(data)



class NotificationUpdateApi(APIView):
    permission_classes = [NotificationPermission]  

    class InputSerializer(serializers.Serializer):
        title = serializers.CharField(required=False)
        message = serializers.CharField(required=False)
        is_read = serializers.BooleanField(required=False)

    def post(self, request, notification_id):
        notification = notification_get(notification_id)

        if notification is None:
            raise Http404

        
        self.check_object_permissions(request, notification)

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        
        updated_notification = notification_update(notification=notification, data=serializer.validated_data)

        data = NotificationDetailApi.OutputSerializer(updated_notification).data
        return Response(data)
