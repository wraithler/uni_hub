from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from api.views import (
    HomeView,
    RegisterView,
    LoginView,
    CommunityListView,
    CommunityDetailView,
    CommunityCreateView,
    CommunityCategoryListView,
    CommunityCategoryCreateView,
    CommunityCategoryDetailView,
    UserDetailView,
    GlobalSearchView,
    VerifyEmailView,
)

urlpatterns = [
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("", HomeView.as_view()),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("communities/", CommunityListView.as_view(), name="community-list"),
    path(
        "communities/<int:pk>/", CommunityDetailView.as_view(), name="community-detail"
    ),
    path("communities/create/", CommunityCreateView.as_view(), name="community-create"),
    path(
        "community-categories/",
        CommunityCategoryListView.as_view(),
        name="community-category-list",
    ),
    path(
        "community-categories/<int:pk>/",
        CommunityCategoryDetailView.as_view(),
        name="community-category-detail",
    ),
    path(
        "community-categories/create/",
        CommunityCategoryCreateView.as_view(),
        name="community-category-create",
    ),
    path(
        "user/",
        UserDetailView.as_view(),
        name="user-detail",
    ),
    path(
        "search/",
        GlobalSearchView.as_view(),
        name="global-search",
    ),
]
