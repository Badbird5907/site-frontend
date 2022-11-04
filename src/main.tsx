import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import {SnackbarProvider} from 'notistack';
import {createTheme,} from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import type {} from '@mui/x-date-pickers/themeAugmentation';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/public-sans';
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import {CssBaseline, PaletteMode, ThemeProvider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";

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

// removed react strict mode
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
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
)
