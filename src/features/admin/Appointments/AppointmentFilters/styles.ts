import { MenuItem } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const EmptyMenuItem = withStyles(MenuItem, {
    root: {
        color: '#858585'
    }
});