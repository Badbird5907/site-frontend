import {createTheme} from "@mui/material/styles";

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

export const theme = createTheme({
    palette: {
        mode: 'dark',
        softBlue: {
            main: '#1b86ff'
        }
    },
});
