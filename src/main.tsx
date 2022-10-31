import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import Main from './pages/main/Main'
import './css/index.css'
import { SnackbarProvider } from 'notistack';
import {
    createBrowserRouter,
    RouterProvider,
    Route, BrowserRouter, Routes,
} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ErrorPage from "./pages/error";
import ErrorBoundary from "./components/ErrorBoundary";

const MainPage = lazy(()=> import("./pages/main/Main"));

const loggedIn = false;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <SnackbarProvider maxSnack={5}>
          <ErrorBoundary>
              <BrowserRouter>
                  <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                          <Route path="/" element={<MainPage/>}/>
                          <Route path="/home" element={<MainPage/>}/>
                          <Route path="/blog" element={<h1>Blog</h1>}/>
                          <Route path={"*"} element={<ErrorPage message="404 Not Found"/>}/>
                      </Routes>
                  </Suspense>
              </BrowserRouter>
          </ErrorBoundary>
      </SnackbarProvider>
  </React.StrictMode>
)
