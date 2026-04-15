import React from 'react';
import { Button, Grid, Paper } from '@mui/material';
import { useZonePlateStyles } from '../../../../hooks/styling/useZonePlateStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

interface LeadTimeProps {
  onEdit: () => void;
}

const LeadTime = ({ onEdit }: LeadTimeProps) => {
  const { classes: centerSettingsClasses } = useZonePlateStyles();
  const { leadDayCounter } = useSelector((state: RootState) => state.capacityServiceValet);

  return (
    <Grid item xs={6} md={4} style={{ height: 202 }}>
      <Paper className={centerSettingsClasses.paper} variant={'outlined'}>
        <h3 className={centerSettingsClasses.title}>Appointment lead time</h3>
        <Button className={centerSettingsClasses.edit} color="primary" onClick={onEdit}>
          EDIT
        </Button>
        <div style={{ marginTop: 24 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>{`[${leadDayCounter || '#'}]`}</p>
          <p style={{ margin: 0 }}>Days</p>
        </div>
      </Paper>
    </Grid>
  );
};

export default LeadTime;
