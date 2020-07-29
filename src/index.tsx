import React from 'react';
import ReactDOM from 'react-dom';
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { Provider } from "react-redux";
import {store} from "./store/store";
import {BrowserRouter} from "react-router-dom";

import {fonts} from "./fonts";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            // '-apple-system',
            // 'BlinkMacSystemFont',
            '"Proxima Nova"',
            'Roboto',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(','),
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': fonts
            }
        }
    }
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
