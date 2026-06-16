import React, { useEffect, useRef, useState } from 'react';
import Agent from '../Agent/Agent';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { getAuthenticationTokenForAdmin } from '../../../api/helper';
import { useStyles } from '../../../pages/admin/ConfigurationAgent/styles';
import { authService } from '../../../api/AuthService/AuthService';

const ALERT_DASHBOARD_URL =
  process.env.REACT_APP_ENV === 'production'
    ? 'https://master.d3uqsgv7ado4jb.amplifyapp.com/'
    : process.env.REACT_APP_ENV === 'PreProd'
      ? 'https://preprod.d3uqsgv7ado4jb.amplifyapp.com/'
      : process.env.REACT_APP_ENV === 'uat'
        ? 'https://uat.d3uqsgv7ado4jb.amplifyapp.com/'
        : 'https://qa.d3uqsgv7ado4jb.amplifyapp.com/';

const AlertDashboard = () => {
  const { selectedSC } = useSCs();
  const accessToken = getAuthenticationTokenForAdmin();
  const { classes } = useStyles();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const sendDataToAgent = (token?: string) => {
    const iframe = iframeRef.current;
    if (selectedSC) {
      iframe?.contentWindow?.postMessage(
        { scID: selectedSC.id, accessToken: token || accessToken },
        ALERT_DASHBOARD_URL
      );
      console.log(`Message sent to iframe successfully with service center ID and access token.`);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIframeLoaded(true);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(ALERT_DASHBOARD_URL).origin) return;

      if (event.data.shouldRefreshToken === true) {
        console.log('Refreshing...');
        // eslint-disable-next-line no-self-assign
        authService
          .refresh()
          .then(token => {
            console.log('Token refreshed successfully.');
            if (token) {
              console.log('Sending token to iframe.');
              sendDataToAgent(token);
            }
          })
          .catch(e => {
            console.log('Error refreshing token: ', e);
          });
      } else {
        console.log('Refresh token flag was not received.');
      }
    };

    window.addEventListener('message', handleMessage);
    iframe.addEventListener('load', handleLoad);
    return () => {
      iframe.removeEventListener('load', handleLoad);
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedSC?.id, iframeLoaded]);

  useEffect(() => {
    if (selectedSC && iframeRef.current && iframeLoaded) {
      sendDataToAgent();
    }
  }, [selectedSC?.id, iframeLoaded]);

  return (
    <>
      <Agent agentName={'Alert Dashboard'} />
      <div className={classes.wrapper}>
        <iframe
          ref={iframeRef}
          id="alert-dashboard"
          src={ALERT_DASHBOARD_URL}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allow="clipboard-write"
        />
      </div>
    </>
  );
};

export default AlertDashboard;
