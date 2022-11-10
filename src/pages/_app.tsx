import "../styles/global.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/public-sans';

import type {AppProps} from "next/app";
import React, {useEffect, useState} from "react";
import AuthService from "../services/AuthService";
import EasterEggs from "../services/EasterEggs";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {CssBaseline, PaletteMode, ThemeProvider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {SnackbarProvider} from "notistack";
import {theme} from "../utils/Theme";
import ErrorBoundary from "../components/ErrorBoundary";

const MyApp = ({Component, pageProps}: AppProps) => {
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
            if (typeof localStorage !== 'undefined')
                localStorage.removeItem("user"); // Remove user from local storage, sometimes it doesn't get removed if it expires or something
        }
        EasterEggs.bootStrap()
    }, []);

    function logout() {
        AuthService.logout();
        if (typeof localStorage !== 'undefined')
            localStorage.removeItem("user");
        if (typeof window !== 'undefined')
            window.location.href = '/';
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider maxSnack={5}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <ErrorBoundary>
                        <Component {...pageProps} />
                    </ErrorBoundary>
                </LocalizationProvider>
            </SnackbarProvider>
        </ThemeProvider>
    )
};

export default MyApp;
