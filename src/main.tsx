import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import {SnackbarProvider} from 'notistack';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <SnackbarProvider maxSnack={5}>
            <ErrorBoundary>
                <App/>
            </ErrorBoundary>
        </SnackbarProvider>
    </React.StrictMode>
)
