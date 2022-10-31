// @ts-nocheck
import React from "react";
import AuthService from "../../services/auth.service";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    <h1>Something went wrong</h1>
                    <h2>While rendering this page/component</h2>
                    <h3>Please try to <a href={''} onClick={() => {
                        window.location.reload()
                    }}>reload</a> this page, or try again later.</h3>
                </>
            );
        }

        return this.props.children;
    }
}
