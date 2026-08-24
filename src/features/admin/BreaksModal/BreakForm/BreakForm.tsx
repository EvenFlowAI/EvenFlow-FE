import React from 'react';
import { TViewMode } from '../../../../components/modals/BaseModal/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { TBreak } from '../types';
import { useStyles } from './styles';
import { TParsableDate } from '../../../../types/types';
import { BreakFormRows } from './BreakFormRows';

type TProps = {
  form: TBreak[];
  workDays: number[];
  onCheck: (day: number, check: boolean) => () => void;
  onChange: (day: number, t: 'from' | 'to') => (date: TParsableDate) => void;
  formIsChecked: boolean;
};

export const BreakForm: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps & TViewMode>>
> = props => {
  const { form, workDays, onCheck, onChange, formIsChecked, viewMode } = props;
  const { classes } = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <BreakFormRows
        form={form}
        workDays={workDays}
        isXS={isXS}
        viewMode={viewMode}
        formIsChecked={formIsChecked}
        containerClassName={classes.container}
        buttonClassName={classes.button}
        textClassName={classes.text}
        onCheck={onCheck}
        onChange={onChange}
      />
    </div>
  );
};
