import React, { useEffect, useRef, useState } from 'react';
import { getAuthenticationTokenForAdmin } from '../../../api/helper';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import Agent from '../../../features/admin/Agent/Agent';
import { useStyles } from './styles';
import { authService } from '../../../api/AuthService/AuthService';

const CONFIGURATION_AGENT_URL =
  process.env.REACT_APP_ENV === 'production' || process.env.REACT_APP_ENV === 'PreProd'
    ? 'https://main.d3v088l5chpnmg.amplifyapp.com/'
    : 'https://develop.d3v088l5chpnmg.amplifyapp.com/';

const ConfigurationAgent = () => {
  const { selectedSC } = useSCs();
  const accessToken = getAuthenticationTokenForAdmin();
  const { classes } = useStyles();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const sendDataToAgent = () => {
    const iframe = iframeRef.current;
    if (selectedSC) {
      iframe?.contentWindow?.postMessage(
        { scID: selectedSC.id, accessToken: accessToken },
        CONFIGURATION_AGENT_URL
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
      if (event.origin !== new URL(CONFIGURATION_AGENT_URL).origin) return;

      if (event.data.shouldRefreshToken === true) {
        console.log('Refreshing...');
        // eslint-disable-next-line no-self-assign
        authService
          .refresh()
          .then(() => {
            sendDataToAgent();
            // eslint-disable-next-line no-self-assign
            iframe.src = iframe.src;
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
  }, []);

  useEffect(() => {
    if (selectedSC && iframeRef.current && iframeLoaded) {
      sendDataToAgent();
    }
  }, [selectedSC?.id, iframeLoaded]);

  return (
    <>
      <Agent agentName={'Configuration Agent'} />
      <div className={classes.wrapper}>
        <iframe
          ref={iframeRef}
          id="configuration-agent"
          src={CONFIGURATION_AGENT_URL}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allow="clipboard-write"
        />
      </div>
    </>
  );
};

export default ConfigurationAgent;
