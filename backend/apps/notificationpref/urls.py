from django.urls import path
from apps.notificationpref.apis import UserNotificationPreferenceRetrieveAPI, UserNotificationPreferenceUpdateAPI

urlpatterns = [
    path('notification-preferences/', UserNotificationPreferenceRetrieveAPI.as_view(), name='notification-preferences-retrieve'),
    path('notification-preferences/update/', UserNotificationPreferenceUpdateAPI.as_view(), name='notification-preferences-update'),
]
