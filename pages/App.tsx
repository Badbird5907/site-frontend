import React, {lazy, Suspense, useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Blogs from "../src/pages/blog/Blogs";
import ViewBlog from "../src/pages/blog/ViewBlog";
import AuthService from "../src/services/AuthService";
import EditOrCreateBlog from "../src/pages/admin/blog/EditOrCreateBlog";
import EasterEggs from "../src/services/EasterEggs";

const AdminDrawer = lazy(() => import("../components/admin/AdminDrawer"));
const MainPage = lazy(() => import("../src/pages/main/Main"));
const ErrorPage = lazy(() => import("../src/pages/error"));
const Loginpage = lazy(() => import("../src/pages/admin/LoginPage"));
const TagsPage = lazy(() => import("../src/pages/admin/tags/TagsPage"));

const App = () => {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [admin, setAdmin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user !== null && typeof (user) !== 'undefined') {
            setCurrentUser(user);
            setAdmin(user.roles.includes("ROLE_ADMIN"));
            console.log('Verifying Token...')
            /*
            if (!verifyAuth) {
                console.log('Token is invalid, logging out...')
                logout()
            }
             */
            AuthService.checkTokenValid();
        }
        console.log('User: ', user);
        const l = AuthService.isLoggedIn();
        console.log('Logged in: ', l);
        setLoggedIn(l);
        if (!l) {
            localStorage.removeItem("user"); // Remove user from local storage, sometimes it doesn't get removed if it expires or something
        }
        EasterEggs.bootStrap()
    }, []);

    function logout() {
        AuthService.logout();
        localStorage.removeItem("user");
        window.location.href = '/';
    }

    return (
        <>
            {
                loggedIn ?
                    <Suspense fallback={<></>}>
                        <AdminDrawer/>
                    </Suspense>
                    : null
            }
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
                                <>
                                    <Route path="/admin/blog/:id" element={<EditOrCreateBlog editing={true}/>}/>
                                    <Route path="/admin/blog/create" element={<EditOrCreateBlog editing={false}/>}/>
                                    <Route path="/admin/tags/" element={<TagsPage/>}/>
                                </>
                                : null
                        }
                        <Route path={"/logout"} element={<LogOut/>}/>
                        <Route path={"/signout"} element={<LogOut/>}/>
                        <Route path={"*"} element={<ErrorPage message="404 Not Found"/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );

    function LogOut() {
        logout();
        return <div/>
    }
};

export default App;
