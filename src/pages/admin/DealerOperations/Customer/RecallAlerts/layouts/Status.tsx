import React from 'react';
import { RecallEventStatus } from '../../types';

const baseStyle: React.CSSProperties = {
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
};

const STATUS_CONFIG: Record<RecallEventStatus, { label: string; backgroundColor: string }> = {
  [RecallEventStatus.ResultsAvailable]: { label: 'Results Available', backgroundColor: '#7898FF' },
  [RecallEventStatus.NotConfigured]: { label: 'Not Configured', backgroundColor: '#B8B9BF' },
  [RecallEventStatus.Failed]: { label: 'Alert Failed', backgroundColor: '#F50057' },
  [RecallEventStatus.Configured]: { label: 'Alert Configured', backgroundColor: 'rgb(175 93 217)' },
  [RecallEventStatus.Running]: { label: 'Alert Running', backgroundColor: '#5FA077' },
  [RecallEventStatus.CheckRequested]: { label: 'Check Requested', backgroundColor: '#FFA500' },
  [RecallEventStatus.Completed]: { label: 'Alert Completed', backgroundColor: '#5E5F66' },
};

const Status = ({ status }: { status: RecallEventStatus }) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <div>-</div>;
  }

  return (
    <div style={{ ...baseStyle, backgroundColor: config.backgroundColor }}>{config.label}</div>
  );
};

export default Status;
