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

const theme = createMuiTheme({});

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ThemeProvider>
            </Provider>
        </CssBaseline>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
