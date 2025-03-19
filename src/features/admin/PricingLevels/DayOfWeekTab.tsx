import React from 'react';
import DayOfWeekTables from '../VariableDemand/DayOfWeekTables/DayOfWeekTables';
import { DayOfWeek } from '../VariableDemand/DayOfWeek/DayOfWeek';
import { Box } from '@mui/material';

export const DayOfWeekTab = () => {
  return (
    <div>
      <DayOfWeek />
      <Box p={1.5} />
      <DayOfWeekTables />
    </div>
  );
};
