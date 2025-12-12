import React from 'react';
import { getAuthenticationTokenForAdmin } from '../../../api/helper';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import Agent from '../../../features/admin/Agent/Agent';
import { useStyles } from './styles';

const CONFIGURATION_AGENT_URL = 'https://main.d3v088l5chpnmg.amplifyapp.com/';

const ConfigurationAgent = () => {
  const { selectedSC } = useSCs();
  const accessToken = getAuthenticationTokenForAdmin();
  const { classes } = useStyles();
  const iframe = document.getElementById('configuration-agent') as HTMLIFrameElement;

  iframe?.addEventListener('load', () => {
    if (accessToken?.length && selectedSC) {
      iframe.contentWindow?.postMessage(
        { scID: selectedSC.id, accessToken: accessToken },
        CONFIGURATION_AGENT_URL
      );
      console.log(`Message sent to iframe successfully with service center ID and access token.`);
    }
  });

  return (
    <>
      <Agent agentName={'Configuration Agent'} />
      <div className={classes.wrapper}>
        <iframe
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
