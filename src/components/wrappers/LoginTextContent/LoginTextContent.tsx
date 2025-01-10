import React from 'react';
import { Typography } from '@mui/material';
import { useStyles } from './styles';

type Props = { content: React.ReactElement | string };

export const LoginTextContent: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<Props>>
> = props => {
  const { classes } = useStyles();
  return (
    <Typography align="center" variant="body1" className={classes.root}>
      {props.content}
    </Typography>
  );
};
