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
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
