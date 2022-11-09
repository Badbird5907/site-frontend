// @ts-nocheck
import React, { Component } from "react";

import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

class AuthVerify extends Component {
    constructor(props) {
        super(props);

        props.history.listen(() => {
            if (typeof localStorage !== 'undefined') {
                const user = JSON.parse(localStorage.getItem("user"));

                if (user) {
                    const decodedJwt = parseJwt(user.token);

                    if (decodedJwt.exp * 1000 < Date.now()) {
                        props.logOut();
                    }
                }
            }
        });
    }

    render() {
        return <div/>;
    }
}

export default withRouter(AuthVerify);
