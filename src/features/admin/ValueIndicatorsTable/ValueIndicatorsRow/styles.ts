import {Button as DefaultButton, styled, TableCell, withStyles} from "@material-ui/core";

export const SliderCell = styled(TableCell)(({theme}) => ({
    [theme.breakpoints.down("xs")]: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px !important`
    }
}))


export const Button = withStyles(theme => ({
    root: {
        fontSize: 14,
        textTransform: "none",
        minWidth: 0,
        padding: "4px 2px",
        marginLeft: 8,
        [theme.breakpoints.down("xs")]: {
            marginLeft: 0
        }
    }
}))(DefaultButton);