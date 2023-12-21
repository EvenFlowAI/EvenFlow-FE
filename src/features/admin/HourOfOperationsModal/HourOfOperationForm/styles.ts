import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    row: {
        marginBottom: 16
    },
    toWrapper: {
        padding: "12px 0",
        textAlign: "center",
        display: "block"
    },
    switchRow: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
            "&>span": {
                left: -theme.spacing(1.5),
                bottom: -theme.spacing(1)
            }
        }
    }
}));