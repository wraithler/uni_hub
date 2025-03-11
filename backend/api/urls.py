from django.urls import path

from api.views import (
    HomeView,
    RegisterView,
    LoginView,
    CommunityListView,
    CommunityDetailView,
)

urlpatterns = [
    path("", HomeView.as_view()),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("communities/", CommunityListView.as_view(), name="community-list"),
    path(
        "communities/<int:pk>/", CommunityDetailView.as_view(), name="community-detail"
    ),
]
