import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from '@/components/Authentication/ProtectedRoute';
import { ChatPage } from '@/pages/Chat.page';
import { CommunitiesPage } from '@/pages/communities/Communities.page';
import { NotFoundPage } from '@/pages/not_found/NotFound.page';
import { VerifyEmailPage } from '@/pages/VerifyEmail.page';
import { AuthPage } from './pages/Auth.page';
import { HomePage } from './pages/Home.page';
import {CommunityPage} from "@/pages/communities/Community.page";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/communities',
    element: (
      <ProtectedRoute>
        <CommunitiesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/community/:communityId',
    element: (
        <ProtectedRoute>
          <CommunityPage/>
        </ProtectedRoute>
    )
  },
  {
    path: '/chat/:chatId',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/verify-email/:token',
    element: <VerifyEmailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
