import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import {store} from "./store/store";
import {BrowserRouter} from "react-router-dom";
import theme from "./theme/theme";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import minMax from "dayjs/plugin/minMax";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(minMax)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(localeData)

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <CssBaseline />
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </LocalizationProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
