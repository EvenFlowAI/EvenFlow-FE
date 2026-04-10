import React from 'react';
import { Avatar } from '@mui/material';
import { getInitials } from '../../../utils/utils';
import { useStyles } from './styles';

type Props = {
  name: string;
  src?: string;
};

export const TableAvatarAccounts: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<Props>>
> = props => {
  const { classes } = useStyles();

  return (
    <Avatar src={props.src} className={classes.rootAccounts}>
      {getInitials(props.name)}
    </Avatar>
  );
};
