import React from 'react';
import { Button, Paper } from '@mui/material';
import { useCardStyles } from '../../../hooks/styling/useCardStyles';

export type TShowEditDataCardProps = {
  onEdit: () => void;
  title: string;
  count: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  helperText: string;
};

export const ShowEditDataCard: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TShowEditDataCardProps>>
> = ({ onEdit, title, count, prefix, suffix, label, helperText }) => {
  const { classes } = useCardStyles();

  return (
    <Paper className={classes.paper} variant={'outlined'}>
      <h3 className={classes.title}>{title}</h3>
      <Button className={classes.edit} color="primary" onClick={onEdit}>
        EDIT
      </Button>
      <div className={classes.value}>
        {prefix}
        {count}
        {suffix}
      </div>
      <div className={classes.label}>{label}</div>
      <div className={classes.helperText}>{helperText}</div>
    </Paper>
  );
};
