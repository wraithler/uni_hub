import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/Login.page.tsx";
import LandingPage from "@/pages/Landing.page.tsx";
import CommunitiesPage from "@/pages/Communities.page.tsx";
import CommunityPage from "@/pages/Community.page.tsx";
import NotFoundPage from "@/pages/NotFound.page.tsx";
import CommunityCreatePage from "@/pages/CommunityCreate.Page.tsx";

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
    path: "/community",
    element: <CommunityPage />,
  },
  {
    path: "/communities/create",
    element: <CommunityCreatePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
