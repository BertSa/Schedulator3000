import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { createTheme, CssBaseline, ThemeOptions, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DialogProvider from './hooks/use-dialog';
import { AuthProvider } from './hooks/use-auth';
import { ServicesProvider } from './hooks/use-services/use-services';

const backup = console.error;
console.error = function filter(msg) {
    const supressedWarnings = ['Warning: Using UNSAFE_component', 'Warning: %s is deprecated in StrictMode'];

    if (!supressedWarnings.some(entry => msg.includes(entry))) {
        backup.apply(console, [msg]);
    }
};

const themeOptions: ThemeOptions = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00796b'
        },
        secondary: {
            main: '#b2ebf2'
        }
    },
});

ReactDOM.render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={ DateAdapter }>
            <ThemeProvider theme={ themeOptions }>
                <CssBaseline />
                <SnackbarProvider TransitionComponent={ Slide as React.ComponentType<TransitionProps> }
                                  anchorOrigin={ {
                                      vertical: 'bottom',
                                      horizontal: 'right'
                                  } }>
                    <DialogProvider>
                        <AuthProvider>
                            <ServicesProvider>
                                <App />
                            </ServicesProvider>
                        </AuthProvider>
                    </DialogProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
