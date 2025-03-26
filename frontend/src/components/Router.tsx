import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/Login.page.tsx";
import LandingPage from "@/pages/Landing.page.tsx";
import CommunitiesPage from "@/pages/Communities.page.tsx";
import CommunityPage from "@/pages/Community.page.tsx";
import { UserProvider } from "@/components/UserProvider.tsx";
import NotFoundPage from "@/pages/NotFound.page.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <UserProvider>
        <LoginPage />
      </UserProvider>
    ),
  },
  {
    path: "/",
    element: (
      <UserProvider>
        <LandingPage />
      </UserProvider>
    ),
  },
  {
    path: "/communities",
    element: (
      <UserProvider>
        <CommunitiesPage />
      </UserProvider>
    ),
  },
  {
    path: "/community",
    element: (
      <UserProvider>
        <CommunityPage />
      </UserProvider>
    ),
  },
  {
    path: "*",
    element: (
      <UserProvider>
        <NotFoundPage />
      </UserProvider>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
