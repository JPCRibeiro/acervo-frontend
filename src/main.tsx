import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { registerApiInterceptors } from './lib/api/interceptors';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './app/(auth)/LoginPage';
import HomePage from './app/HomePage';

registerApiInterceptors();

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { path: 'login', Component: LoginPage },
      {
        Component: ProtectedLayout,
        children: [
          { index: true, Component: HomePage },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)