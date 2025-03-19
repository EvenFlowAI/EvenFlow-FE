import { FormControlLabel } from '@mui/material';

import { withStyles } from 'tss-react/mui';

export const Label = withStyles(FormControlLabel, {
  root: {
    marginLeft: 0,
  },
  label: {
    fontWeight: 'bold',
  },
});
