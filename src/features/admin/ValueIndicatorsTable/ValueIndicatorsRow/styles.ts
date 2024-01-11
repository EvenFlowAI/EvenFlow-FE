import { Button as DefaultButton, styled, TableCell } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const SliderCell = styled(TableCell)(({theme}) => ({
    [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(1)} ${theme.spacing(2)} !important`
    }
}))


export const Button = withStyles(theme => ({
    root: {
        fontSize: 14,
        textTransform: "none",
        minWidth: 0,
        padding: "4px 2px",
        marginLeft: 8,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0
        }
    }
}))(DefaultButton);