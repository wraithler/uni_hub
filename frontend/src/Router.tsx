import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFound.page';
import { AuthPage } from './pages/Auth.page';
import { HomePage } from './pages/Home.page';
import {CommunitiesPage} from "@/pages/communities/Communities.page";

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
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
