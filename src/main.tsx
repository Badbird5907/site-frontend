import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import {SnackbarProvider} from 'notistack';
import {deepmerge} from '@mui/utils';
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendMuiTheme,
} from '@mui/material/styles';

import {extendTheme as extendJoyTheme} from '@mui/joy/styles';
const muiTheme = extendMuiTheme();
const joyTheme = extendJoyTheme(JoyTheme.getJoyThemeOptions(muiTheme));
const theme = deepmerge(joyTheme, muiTheme);


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/public-sans';
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import JoyTheme from "./utils/JoyTheme";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <CssVarsProvider theme={theme}>
            <SnackbarProvider maxSnack={5}>
                <ErrorBoundary>
                    <App/>
                </ErrorBoundary>
            </SnackbarProvider>
        </CssVarsProvider>
    </React.StrictMode>
)
