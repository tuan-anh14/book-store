import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AboutPage from 'pages/client/about';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import ForgotPasswordPage from 'pages/client/auth/forgot-password';
import VerifyEmailPage from 'pages/client/auth/verify-email';
import 'styles/global.scss'
import HomePage from 'pages/client/home';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from '@/components/auth';
import DashBoardPage from 'pages/admin/dashboard';
import ManageBookPage from 'pages/admin/manage.book';
import ManageOrderPage from 'pages/admin/manage.order';
import ManageUserPage from 'pages/admin/manage.user';
import LayoutAdmin from 'components/layout/layout.admin';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import BookPage from './pages/client/book';
import OrderPage from './pages/client/order';
import HistoryPage from './pages/client/history';
import ManageCategoryPage from 'pages/admin/manage.category';
import CheckoutPage from './pages/client/checkout';
import PaymentResultPage from './pages/client/payment_result';
import ChatBot from './components/chatbot/chatbot';
import ManageCommentPage from './pages/admin/manage.comment';
import SupportCenter from './components/client/support/support.center';
import SupportRequest from './components/client/support/support.request';
import ManageRequestPage from 'pages/admin/manage.request';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment-result",
        element: (
          <ProtectedRoute>
            <PaymentResultPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/support",
        element: <SupportCenter />,
      },
      {
        path: "/support/request",
        element: <SupportRequest />,
      },
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "category",
        element: (
          <ProtectedRoute>
            <ManageCategoryPage />
          </ProtectedRoute>
        )
      },
      {
        path: "request",
        element: (
          <ProtectedRoute>
            <ManageRequestPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>admin page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "comment",
        element: (
          <ProtectedRoute>
            <ManageCommentPage />
          </ProtectedRoute>
        )
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
        <ChatBot apiKey={import.meta.env.VITE_GEMINI_API_KEY} />
      </AppProvider>
    </App>
  </StrictMode>,
)
