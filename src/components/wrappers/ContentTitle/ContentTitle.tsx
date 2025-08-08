import React from 'react';
import { Typography } from '@mui/material';
import { useStyles } from './styles';
import { TTitle } from '../../../types/types';
import { collectParents } from './utils';

type TTitleProps = {
  title: string;
  parent?: TTitle;
  subtitle?: string;
};

type TTitleForDealerOperationsProps = {
  title: string;
  parent: TTitle;
  secondParent: TTitle;
  subtitle?: string;
  actions?: () => void;
};

export const ContentTitle: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTitleProps>>
> = props => {
  const { classes } = useStyles();
  return (
    <div className={classes.titleContainer}>
      <Typography className={classes.title} variant="h2">
        {props.parent ? (
          <span className={classes.rootTitle}>{collectParents(props.parent)} / </span>
        ) : null}
        {props.title}
      </Typography>
      {props.subtitle ? (
        <Typography className={classes.subtitle} variant="subtitle1">
          {props.subtitle}
        </Typography>
      ) : null}
    </div>
  );
};

export const ContentTitleForDealerOperation: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTitleForDealerOperationsProps>>
> = props => {
  const { classes } = useStyles();
  return (
    <div className={classes.titleContainer}>
      <Typography className={classes.title} variant="h2">
        {props.parent ? (
          <span className={classes.rootTitle}>
            {collectParents(props.secondParent)} /{' '}
            <span className={classes.secondParent} onClick={props.actions}>
              {props.parent.title}
            </span>{' '}
            /{' '}
          </span>
        ) : null}
        {props.title}
      </Typography>
    </div>
  );
};
