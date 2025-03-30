
from django.urls import path
from apps.profile.apis import ProfileView, ProfileCreateView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile-detail'),
    path('profile/create/', ProfileCreateView.as_view(), name='profile-create'),
]
