import React from 'react';
import { Link, LinkProps } from '@mui/material';
import { Link as BLink } from 'react-router-dom';

export const BackLink: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<LinkProps & { to: string }>>
> = props => {
  return (
    <Link
      style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
      component={BLink}
      to={props.to}
      underline="hover"
    >
      {props.children}
    </Link>
  );
};
