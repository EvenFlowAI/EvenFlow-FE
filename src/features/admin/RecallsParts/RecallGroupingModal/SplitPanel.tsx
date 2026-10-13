import React, { useState } from 'react';
import { Button, Checkbox, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useRecallGroupingStyles } from './styles';
import { TSplitOptions } from './types';

type TProps = {
  onClose: () => void;
  onSplit: (options: TSplitOptions) => void;
};

export const SplitPanel: React.FC<React.PropsWithChildren<TProps>> = ({ onClose, onSplit }) => {
  const { classes } = useRecallGroupingStyles();
  const [options, setOptions] = useState<TSplitOptions>({ byModel: false, byYear: false });

  const toggle = (name: keyof TSplitOptions) => () =>
    setOptions(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className={classes.panel}>
      <IconButton className={classes.panelClose} size="small" onClick={onClose}>
        <Close fontSize="small" />
      </IconButton>
      <Typography className={classes.panelTitle}>Split records into groups</Typography>
      <div className={classes.panelBody}>
        <label className={classes.option}>
          <Checkbox
            size="small"
            color="primary"
            checked={options.byModel}
            onChange={toggle('byModel')}
          />
          <div>
            <Typography className={classes.optionTitle}>By Model</Typography>
            <Typography className={classes.optionDescription}>
              Split records into groups by vehicle model
            </Typography>
          </div>
        </label>
        <label className={classes.option}>
          <Checkbox
            size="small"
            color="primary"
            checked={options.byYear}
            onChange={toggle('byYear')}
          />
          <div>
            <Typography className={classes.optionTitle}>By Year</Typography>
            <Typography className={classes.optionDescription}>
              Split records into groups by model year
            </Typography>
          </div>
        </label>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.panelAction}
          disabled={!options.byModel && !options.byYear}
          onClick={() => onSplit(options)}
        >
          Split
        </Button>
      </div>
    </div>
  );
};
