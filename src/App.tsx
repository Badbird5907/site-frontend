import React, {lazy, Suspense, useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Blogs from "./pages/blog/Blogs";
import ViewBlog from "./pages/blog/ViewBlog";
import AuthService from "./services/AuthService";
import verifyAuth from "./services/auth-verify";
import EditBlog from "./pages/blog/admin/EditBlog";
import EasterEggs from "./services/EasterEggs";

const MainPage = lazy(() => import("./pages/main/Main"));
//const Blog = lazy(() => import("./pages/blog/Blog"));
//const ViewBlog = lazy(() => import("./pages/blog/ViewBlog"));
const ErrorPage = lazy(() => import("./pages/error"));
const Loginpage = lazy(() => import("./pages/other/LoginPage"));

const App = () => {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [admin, setAdmin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user !== null && typeof (user) !== 'undefined') {
            setCurrentUser(user);
            setAdmin(user.roles.includes("ROLE_ADMIN"));
            if (!verifyAuth) {
                logout()
            }
        }
        console.log('User: ', currentUser);
        setLoggedIn(AuthService.isLoggedIn());
        console.log('Logged in: ', loggedIn);
        EasterEggs.bootStrap()
    }, []);

    function logout() {
        AuthService.logout().then(r => {
            localStorage.removeItem("user");
        });
        window.location.href = '/';
    }

    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/home" element={<MainPage/>}/>
                        <Route path="/blog" element={<Blogs/>}/>
                        <Route path="/login" element={<Loginpage/>}/>
                        <Route path="/blog/:id" element={<ViewBlog/>}/>
                        {
                            loggedIn ?
                                <Route path="/admin/blog/:id" element={<EditBlog/>}/>
                                : null
                        }
                        <Route path={"*"} element={<ErrorPage message="404 Not Found"/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
};

export default App;
