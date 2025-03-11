import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import {NotFoundPage} from '@/pages/NotFound.page';
import {AuthPage} from './pages/Auth.page';
import {HomePage} from './pages/Home.page';
import {UserProvider} from "@/components/UserProvider";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login"/>;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <AuthPage/>;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <UserProvider>
                    <HomePage/>
                </UserProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: <AuthPage/>,
    },
    {
        path: '/register',
        element: <RegisterAndLogout/>,
    },
    {
        path: '/logout',
        element: <Logout/>,
    },
    {
        path: '*',
        element: <NotFoundPage/>,
    },
]);

export function Router() {
    return <RouterProvider router={router}/>;
}
