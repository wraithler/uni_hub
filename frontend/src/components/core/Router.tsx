import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/Login.page.tsx";
import LandingPage from "@/pages/Landing.page.tsx";
import CommunitiesPage from "@/pages/communities/Communities.page.tsx";
import CommunityPage from "@/pages/communities/Community.page.tsx";
import CommunityCreatePage from "@/pages/communities/CommunityCreate.Page.tsx";
import EventsPage from "@/pages/events/Events.page.tsx";
import EventPage from "@/pages/events/Event.page.tsx";
import EventCreatePage from "@/pages/events/EventCreate.Page.tsx";
import FeedPage from "@/pages/Feed.page.tsx";
import NotFoundPage from "@/pages/NotFound.page.tsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute.tsx";
import TermsOfServicePage from "@/pages/legal/TermsOfService.page.tsx";
import SendVerificationEmailPage from "@/pages/email-verification/SendVerificationEmail.page.tsx";
import VerifyEmailPage from "@/pages/email-verification/VerifyEmail.page.tsx";
import CommunityDashboardPage from "@/pages/communities/dashboard/CommunityDashboard.page.tsx";
import ProfilePage from "@/pages/profiles/Profile.page.tsx";
import ProfileOtherPage from "@/pages/profiles/ProfileOtherPage.page.tsx";
import CommunityApprovalPage from "@/pages/communities/CommunityApprovalPage.tsx";
import UsersPage from "@/pages/Users.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/communities",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <CommunitiesPage />,
      },
      {
        path: ":id",
        element: <CommunityPage />,
      },
      {
        path: "/communities/:id/dashboard",
        element: <CommunityDashboardPage />,
      },
    ],
  },
  {
    path: "/communities/create",
    element: <ProtectedRoute requireEmailVerification={true} />,
    children: [
      {
        path: "",
        element: <CommunityCreatePage />,
      },
    ],
  },
  {
    path: "/events",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <EventsPage />,
      },
      {
        path: ":id",
        element: <EventPage />,
      },
    ],
  },
  {
    path: "/events/create",
    element: <ProtectedRoute requireEmailVerification={true} />,
    children: [
      {
        path: "",
        element: <EventCreatePage />,
      },
    ],
  },
  {
    path: "/feed",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <FeedPage />,
      },
    ],
  },
  {
    path: "/verification-email",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/verification-email/send",
        element: <SendVerificationEmailPage />,
      },
      {
        path: "/verification-email/verify/:uid/:token",
        element: <VerifyEmailPage />,
      },
    ],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/:id",
    element: <ProfileOtherPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/terms",
    element: <TermsOfServicePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/communities/approval",
    element: <ProtectedRoute requireSuperuser={true} />,
    children: [
      {
        path: "/communities/approval",
        element: <CommunityApprovalPage />,
      },
    ],
  },
  {
    path: "/users",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/users",
        element: <UsersPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
