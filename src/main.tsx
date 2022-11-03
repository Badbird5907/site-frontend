import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import {SnackbarProvider} from 'notistack';
import {deepmerge} from '@mui/utils';
import {
    useColorScheme,
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendMuiTheme,
} from '@mui/material/styles';

import {extendTheme as extendJoyTheme} from '@mui/joy/styles';

// Note: you can't put `joyTheme` inside Material UI's `extendMuiTheme(joyTheme)` because
//       some of the values in the Joy UI theme refers to CSS variables abd not raw colors.
const muiTheme = extendMuiTheme();

const joyTheme = extendJoyTheme({
    // This is required to point to `var(--mui-*)` because we are using `CssVarsProvider` from Material UI.
    cssVarPrefix: 'mui',
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    ...blue,
                    solidColor: 'var(--mui-palette-primary-contrastText)',
                    solidBg: 'var(--mui-palette-primary-main)',
                    solidHoverBg: 'var(--mui-palette-primary-dark)',
                    plainColor: 'var(--mui-palette-primary-main)',
                    plainHoverBg:
                        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
                    plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
                    outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
                    outlinedColor: 'var(--mui-palette-primary-main)',
                    outlinedHoverBg:
                        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
                    outlinedHoverBorder: 'var(--mui-palette-primary-main)',
                    outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
                },
                neutral: {
                    ...grey,
                },
                // Do the same for the `danger`, `info`, `success`, and `warning` palettes,
                divider: 'var(--mui-palette-divider)',
                text: {
                    tertiary: 'rgba(0 0 0 / 0.56)',
                },
            },
        },
        // Do the same for dark mode
        // dark: { ... }
    },
    fontFamily: {
        display: '"Roboto","Helvetica","Arial",sans-serif',
        body: '"Roboto","Helvetica","Arial",sans-serif',
    },
    shadow: {
        xs: `var(--mui-shadowRing), ${muiTheme.shadows[1]}`,
        sm: `var(--mui-shadowRing), ${muiTheme.shadows[2]}`,
        md: `var(--mui-shadowRing), ${muiTheme.shadows[4]}`,
        lg: `var(--mui-shadowRing), ${muiTheme.shadows[8]}`,
        xl: `var(--mui-shadowRing), ${muiTheme.shadows[12]}`,
    },
});

// You can use your own `deepmerge` function.
// muiTheme will deeply merge to joyTheme.
const theme = deepmerge(joyTheme, muiTheme);


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/public-sans';
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import {blue, grey} from "@mui/material/colors";


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
