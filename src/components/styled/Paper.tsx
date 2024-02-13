import { Paper } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const SquarePaper = withStyles(Paper, {root: {borderRadius: 2}});