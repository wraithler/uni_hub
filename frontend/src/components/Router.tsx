import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/Login.page.tsx";
import LandingPage from "@/pages/Landing.page.tsx";
import CommunitiesPage from "@/pages/communities/Communities.page.tsx";
import CommunityPage from "@/pages/communities/Community.page.tsx";
import NotFoundPage from "@/pages/NotFound.page.tsx";
import CommunityCreatePage from "@/pages/communities/CommunityCreate.Page.tsx";
import FeedPage from "@/pages/Feed.page.tsx";

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
    element: <CommunitiesPage />,
  },
  {
    path: "/community/:id",
    element: <CommunityPage />,
  },
  {
    path: "/communities/create",
    element: <CommunityCreatePage />,
  },
  {
    path: "/feed",
    element: <FeedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
