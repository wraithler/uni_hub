from django.urls import path
from apps.notificationpref.apis import UserNotificationPreferenceView

app_name = "notificationpref"  # Ensure this is defined

urlpatterns = [
    path('notification-preferences/', UserNotificationPreferenceView.as_view(), name='notification-preferences'),
]