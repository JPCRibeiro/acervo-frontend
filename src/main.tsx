import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import App from './App';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
