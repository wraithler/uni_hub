import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import {NotFoundPage} from '@/pages/not_found/NotFound.page';
import {AuthPage} from './pages/Auth.page';
import {HomePage} from './pages/Home.page';
import {CommunitiesPage} from "@/pages/communities/Communities.page";
import {VerifyEmailPage} from "@/pages/VerifyEmail.page";
import {ChatPage} from "@/pages/Chat.page";

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <HomePage/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/communities',
        element: (
            <ProtectedRoute>
                <CommunitiesPage/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/chat/:chatId',
        element: (
            <ProtectedRoute>
                <ChatPage/>
            </ProtectedRoute>
        )
    },
    {
        path: '/login',
        element: <AuthPage/>,
    },
    {
        path: '/verify-email/:token',
        element: <VerifyEmailPage/>,
    },
    {
        path: '*',
        element: <NotFoundPage/>,
    },
]);

export function Router() {
    return <RouterProvider router={router}/>;
}
