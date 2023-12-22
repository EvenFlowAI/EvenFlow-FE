import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        fontSize: 12,
        width: 30,
        height: 30
    }
}));