import React from 'react'
import './css/index.css'
import {SnackbarProvider} from 'notistack';
import {createTheme,} from '@mui/material/styles';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import ErrorBoundary from '../components/ErrorBoundary'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/public-sans';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import App from "./App";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
        palette: {
            mode: 'dark',
        }
    }

    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }

    interface Palette {
        softBlue: Palette['primary'];
    }

    interface PaletteOptions {
        softBlue?: PaletteOptions['primary'];
    }
}
// Update the Button's color prop options
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        softBlue: true;
    }
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        softBlue: {
            main: '#1b86ff'
        }
    },
});

export {Page}

function Page() {
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <SnackbarProvider maxSnack={5}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <ErrorBoundary>
                            <App/>
                        </ErrorBoundary>
                    </LocalizationProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </>
    )
}
