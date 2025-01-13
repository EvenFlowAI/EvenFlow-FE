import React from 'react';
import { CircularProgressProps, CircularProgress, Grid } from '@mui/material';

export const Loading: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<CircularProgressProps>>
> = props => {
  return (
    <Grid container justifyContent="center">
      <CircularProgress {...props} />
    </Grid>
  );
};
