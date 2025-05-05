import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/Login.page.tsx";
import LandingPage from "@/pages/Landing.page.tsx";
import CommunitiesPage from "@/pages/communities/Communities.page.tsx";
import CommunityPage from "@/pages/communities/Community.page.tsx";
import NotFoundPage from "@/pages/NotFound.page.tsx";
import CommunityCreatePage from "@/pages/communities/CommunityCreate.Page.tsx";
import FeedPage from "@/pages/Feed.page.tsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute.tsx";
import TermsOfServicePage from "@/pages/legal/TermsOfService.page.tsx";
import SendVerificationEmailPage from "@/pages/email-verification/SendVerificationEmail.page.tsx";
import VerifyEmailPage from "@/pages/email-verification/VerifyEmail.page.tsx";
import CommunityDashboardPage from "@/pages/communities/dashboard/CommunityDashboard.page.tsx";
import PostPage from "@/pages/posts/Post.page.tsx";

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
        path: "/communities/:id",
        element: <CommunityPage />,
      },
      {
        path: "/communities/:id/dashboard",
        element: <CommunityDashboardPage/>
      }
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
    path: "/posts/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <PostPage />,
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
