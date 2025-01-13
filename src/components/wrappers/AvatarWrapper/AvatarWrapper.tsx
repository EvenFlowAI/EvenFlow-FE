import React from 'react';
import { AvatarUpload, TAvatarProps } from '../../formControls/AvatarUpload/AvatarUpload';
import { Container } from '@mui/material';
import { useStyles } from './styles';

export const AvatarWrapper: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAvatarProps>>
> = props => {
  const { classes } = useStyles();
  return (
    <Container className={classes.avatarWrapper}>
      <AvatarUpload {...props} />
    </Container>
  );
};
