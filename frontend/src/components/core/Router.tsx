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
    path: "/terms",
    element: <TermsOfServicePage/>
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
