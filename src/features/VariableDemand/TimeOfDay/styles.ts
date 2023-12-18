import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme =>({
    message: {
        fontSize: 14,
        [theme.breakpoints.down("lg")]: {
            fontSize: 11
        }
    },
    rowWrapper: {
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2)
        }
    }
}));