import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme/theme';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekday from 'dayjs/plugin/weekday';
import { ErrorBoundary } from 'react-error-boundary';
import FallBack from './components/FallBack/FallBack';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(localeData);
dayjs.extend(weekday);

const currentVersion = process.env.REACT_APP_VERSION || new Date().getTime().toString();
const storedVersion = localStorage.getItem('app_version');

localStorage.setItem('app_version', currentVersion);

if (storedVersion && storedVersion !== currentVersion) {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }

  window.location.reload();
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<FallBack />}>
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
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
