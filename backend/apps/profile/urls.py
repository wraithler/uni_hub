from django.urls import path
from apps.profile.apis import ProfileView, ProfileCreateView, ProfileChoicesView

urlpatterns = [

    path("", ProfileCreateView.as_view(), name="profile-list-create"),
    path("<int:pk>/", ProfileView.as_view(), name="profile-detail"),
    path("create/", ProfileCreateView.as_view(), name="profile-create"),
    path("choices/", ProfileChoicesView.as_view(), name="profile-choices"),
]
