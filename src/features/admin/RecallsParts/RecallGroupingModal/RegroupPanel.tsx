import React, { useState } from 'react';
import { Button, IconButton, Radio, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useRecallGroupingStyles } from './styles';
import { ERegroupMode } from './types';

type TProps = {
  onClose: () => void;
  onRegroup: (mode: ERegroupMode) => void;
};

export const RegroupPanel: React.FC<React.PropsWithChildren<TProps>> = ({ onClose, onRegroup }) => {
  const { classes } = useRecallGroupingStyles();
  const [mode, setMode] = useState<ERegroupMode>(ERegroupMode.UseFirstGroup);

  return (
    <div className={classes.panel}>
      <IconButton className={classes.panelClose} size="small" onClick={onClose}>
        <Close fontSize="small" />
      </IconButton>
      <Typography className={classes.panelTitle}>Group records into a single one</Typography>
      <div className={classes.panelBody}>
        <label className={classes.option}>
          <Radio
            size="small"
            color="primary"
            checked={mode === ERegroupMode.UseFirstGroup}
            onChange={() => setMode(ERegroupMode.UseFirstGroup)}
          />
          <div>
            <Typography className={classes.optionTitle}>Use Group 1 settings</Typography>
            <Typography className={classes.optionDescription}>
              Set unique Recall component, Op code, Part lead time and Daily Parts settings to match
              group 1
            </Typography>
          </div>
        </label>
        <label className={classes.option}>
          <Radio
            size="small"
            color="primary"
            checked={mode === ERegroupMode.ResetToDefault}
            onChange={() => setMode(ERegroupMode.ResetToDefault)}
          />
          <div>
            <Typography className={classes.optionTitle}>Reset to default settings</Typography>
            <Typography className={classes.optionDescription}>
              Reset Recall component, Op code, Part lead time and Daily Parts settings to default
              values
            </Typography>
          </div>
        </label>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.panelAction}
          onClick={() => onRegroup(mode)}
        >
          Regroup
        </Button>
      </div>
    </div>
  );
};
