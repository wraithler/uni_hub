from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from api.views import (
    HomeView,
    RegisterView,
    LoginView,
    CommunityListView,
    CommunityDetailView,
    CommunityCreateView,
    FeedbackListView, 
    FeedbackCreateView, 
)

urlpatterns = [
    path("", HomeView.as_view()),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("communities/", CommunityListView.as_view(), name="community-list"),
    path(
        "communities/<int:pk>/", CommunityDetailView.as_view(), name="community-detail"
    ),
    path("communities/create/", CommunityCreateView.as_view(), name="community-create"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

      
    path("feedback/create/", FeedbackCreateView.as_view(), name="feedback-create"),  
    path("feedback/", FeedbackListView.as_view(), name="feedback-list"),
]
