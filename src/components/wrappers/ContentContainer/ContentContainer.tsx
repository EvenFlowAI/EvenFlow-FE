import React from 'react';
import { Container, ContainerProps } from '@mui/material';
import { useStyles } from './styles';

export const ContentContainer: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<ContainerProps>>
> = props => {
  const { classes } = useStyles();

  return <Container className={classes.root} disableGutters {...props} children={props.children} />;
};
