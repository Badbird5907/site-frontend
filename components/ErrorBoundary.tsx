import React, {ErrorInfo} from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }

    render() {
        // @ts-ignore
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    <h1>Something went wrong</h1>
                    <h2>While rendering this page/component</h2>
                    <h3>Please try to <a href={''} onClick={() => {
                        if (typeof window !== 'undefined')
                            window.location.reload()
                    }}>reload</a> this page, or try again later.</h3>
                </>
            );
        }

        // @ts-ignore
        return this.props.children;
    }
}
