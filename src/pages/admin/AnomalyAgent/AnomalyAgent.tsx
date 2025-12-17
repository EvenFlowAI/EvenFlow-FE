import React from 'react';
import Agent from '../../../features/admin/Agent/Agent';

const AnomalyAgent = () => {
  return (
    <>
      <Agent agentName={'Anomaly Agent'} />
      <React.Fragment>
        <p
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          Coming Soon
        </p>
      </React.Fragment>
    </>
  );
};

export default AnomalyAgent;
