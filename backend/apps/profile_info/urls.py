
from django.urls import path
from .apis import ProfileInfoView
from apps.profile_info.apis import ProfileInfoView

urlpatterns = [
    path('profile/', ProfileInfoView.as_view(), name='profile-current'),
    path('profile/<int:user_id>/', ProfileInfoView.as_view(), name='profile-detail'),
   
]

