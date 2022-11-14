import React, {useEffect} from 'react';
import AuthService from "../../services/AuthService";

const Index = () => {
    useEffect(() => {
        AuthService.logout();
        localStorage.removeItem("user");
        window.location.href = '/';
    },[]);
    return (
        <div/>
    );
};

export default Index;
