from .auth_views import RegisterView as RegisterView
from .auth_views import LoginView as LoginView
from .home_views import HomeView as HomeView
from .community_views import CommunityListView as CommunityListView
from .community_views import CommunityDetailView as CommunityDetailView
from .community_views import CommunityCreateView as CommunityCreateView
from .community_views import CommunityCategoryListView as CommunityCategoryListView
from .community_views import CommunityCategoryDetailView as CommunityCategoryDetailView
from .community_views import CommunityCategoryCreateView as CommunityCategoryCreateView
from .user_views import UserDetailView as UserDetailView
from .global_search_view import GlobalSearchView as GlobalSearchView
from .auth_views import VerifyEmailView as VerifyEmailView
from .auth_views import VerifyEmailView as VerifyEmailView
from .event_views import EventListView as EventListView
from .event_views import EventDetailView as EventDetailView
from .event_views import EventCreateView as EventCreateView
from .event_views import EventAttendanceView as EventAttendanceView
from .event_views import VirtualEventAccessView as VirtualEventAccessView
from .feedback_views import FeedbackListView, FeedbackCreateView, FeedbackDeleteView
from .profile_Info_views import ProfileInfoView
from .notif_pref_views import UserNotificationPreferenceView