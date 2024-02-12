import { Tooltip } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const HtmlTooltip = withStyles(Tooltip, {
    tooltip: {
        fontSize: 13,
        color: '#202021',
        background: '#D1D1D1',
    },
    popper: {
        borderRadius: 2,
    }
});