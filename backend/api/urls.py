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
    FeedbackDeleteView,
    CommunityCategoryListView,
    CommunityCategoryCreateView,
    PostListView,
    PostDetailView,
    PostCreateView,
    CommunityCategoryDetailView,
    UserDetailView,
    EventListView,
    EventDetailView,
    EventCreateView,
    EventAttendanceView,
    VirtualEventAccessView,
    GlobalSearchView,
    VerifyEmailView,
    ProfileInfoView,
    UserNotificationPreferenceView,
)

urlpatterns = [
    path("", HomeView.as_view()),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("communities/", CommunityListView.as_view(), name="community-list"),
    path("communities/<int:pk>/", CommunityDetailView.as_view(), name="community-detail"),
    path("communities/create/", CommunityCreateView.as_view(), name="community-create"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

      
    path("feedback/create/", FeedbackCreateView.as_view(), name="feedback-create"),  
    path("feedback/", FeedbackListView.as_view(), name="feedback-list"),
    path('feedback/<int:feedback_id>/', FeedbackDeleteView.as_view(), name='feedback-delete'),

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
        "posts/", 
        PostListView.as_view(), 
        name="post-list"
    ),

    path(
        "posts/<int:pk>/", 
        PostDetailView.as_view(), 
        name="post-detail"
    ),

    path(
        "posts/create/", 
        PostCreateView.as_view(), 
        name="post-create"
    ),

    path(
        "search/",
        GlobalSearchView.as_view(),
        name="global-search",
    ),
    path("community-categories/", CommunityCategoryListView.as_view(), name="community-category-list"),
    path("community-categories/<int:pk>/", CommunityCategoryDetailView.as_view(), name="community-category-detail"),
    path("community-categories/create/", CommunityCategoryCreateView.as_view(), name="community-category-create"),
    path("user/", UserDetailView.as_view(), name="user-detail"),

    # Event URLs
    path("events/", EventListView.as_view(), name="event-list"),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("events/create/", EventCreateView.as_view(), name="event-create"),
    path("events/<int:pk>/attend/", EventAttendanceView.as_view(), name="event-attendance"),
    path("events/<int:pk>/virtual/", VirtualEventAccessView.as_view(), name="virtual-event-access"),

    path('profile/<int:user_id>/', ProfileInfoView.as_view(), name='profile-info'),
    path('notification-preferences/<int:user_id>/', UserNotificationPreferenceView.as_view(), name='notification-preferences-detail'),
]
