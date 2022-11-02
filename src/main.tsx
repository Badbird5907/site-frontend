import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import {SnackbarProvider} from 'notistack';
import {BrowserRouter, Route, Routes,} from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ErrorBoundary from "./components/ErrorBoundary";

const MainPage = lazy(() => import("./pages/main/Main"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const ViewBlog = lazy(() => import("./pages/blog/ViewBlog"));
const ErrorPage = lazy(() => import("./pages/error"));
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
                            <Route path="/blog" element={<Blog/>}/>
                            <Route path="/blog/view/:id" element={<ViewBlog/>}/>
                            <Route path={"*"} element={<ErrorPage message="404 Not Found"/>}/>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </ErrorBoundary>
        </SnackbarProvider>
    </React.StrictMode>
)
