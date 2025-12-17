import React, { useEffect, useRef, useState } from 'react';
import { getAuthenticationTokenForAdmin } from '../../../api/helper';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import Agent from '../../../features/admin/Agent/Agent';
import { useStyles } from './styles';

const CONFIGURATION_AGENT_URL =
  process.env.REACT_APP_ENV === 'production' || process.env.REACT_APP_ENV === 'PreProd'
    ? 'https://main.d3v088l5chpnmg.amplifyapp.com/'
    : 'https://develop.d3v088l5chpnmg.amplifyapp.com/';

console.log('env: ', process.env.REACT_APP_ENV);

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

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
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
