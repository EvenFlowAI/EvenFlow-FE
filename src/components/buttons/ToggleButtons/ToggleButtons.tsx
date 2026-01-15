import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import { InputLabel } from '@mui/material';
import { useStyles } from './styles';
import { TTechnicianLevel } from '../../../types/types';

export type TButtonElement = {
  value: TTechnicianLevel;
  label: string;
  id: string;
};

type TProps = {
  buttons: TButtonElement[];
  onChange: (e: React.MouseEvent<HTMLElement>, value: TTechnicianLevel) => void;
  value: TTechnicianLevel;
  label?: string;
  exclusive?: boolean;
};

export const ToggleButtons: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = props => {
  const { classes } = useStyles();

  return (
    <div>
      <InputLabel className={classes.label} shrink>
        {props.label}
      </InputLabel>
      <ToggleButtonGroup
        className={classes.root}
        exclusive={props.exclusive}
        onChange={props.onChange}
        value={props.value}
      >
        {props.buttons.map(b => (
          <ToggleButton className={classes.button} key={b.id} value={b.value}>
            {b.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};
