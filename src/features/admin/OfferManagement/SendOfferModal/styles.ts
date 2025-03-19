import { FormLabel } from '@mui/material';

import { withStyles } from 'tss-react/mui';

export const Label = withStyles(FormLabel, theme => ({
  root: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
}));
