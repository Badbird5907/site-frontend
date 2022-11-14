import React, {useEffect} from 'react';
import {backendURL as apiBackend} from '../../services/APIService';
import AuthService from "../../services/AuthService";
import {Stack} from "@mui/material";

const Index = () => {
    const runtime = process.env.NEXT_RUNTIME;
    const [backendURL, setBackendURL] = React.useState(apiBackend);
    const [loggedIn, setLoggedIn] = React.useState(AuthService.isLoggedIn());

    return (
        <div>
            <Stack direction={"column"} spacing={2}>
                <span>Runtime: {runtime}</span>
                <span>Backend URL: {backendURL}</span>
                <span>Logged in: {loggedIn ? "true" : "false"}</span>
            </Stack>
        </div>
    );
};

export default Index;
