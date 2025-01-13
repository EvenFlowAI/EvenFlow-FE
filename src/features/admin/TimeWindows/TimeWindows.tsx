import React from 'react';
import { ProximityTable } from '../ProximityTable/ProximityTable';
import { TimeWindowsTable } from './TimeWindowsTable/TimeWindowsTable';

const TimeWindows = () => {
  return (
    <div>
      <ProximityTable />
      <div style={{ padding: 16 }}></div>
      <TimeWindowsTable />
    </div>
  );
};

export default TimeWindows;
