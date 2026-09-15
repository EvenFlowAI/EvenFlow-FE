import React from 'react';
import { Button } from '@mui/material';
import { useStyles } from './styles';

const ServicePulse = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button variant="text" onClick={() => {}}>
          Edit Play Name
        </Button>
      </div>
    </div>
  );
};

export default ServicePulse;
