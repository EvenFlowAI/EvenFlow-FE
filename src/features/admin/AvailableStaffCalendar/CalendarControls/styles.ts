import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    controls: {
        [theme.breakpoints.down("xs")]: {
            textAlign: "center"
        }
    },
    controlButton: {
        borderRadius: 0,
        marginRight: 11,
        padding: 5,
        minWidth: 30,
    },
    controlDay: {
        padding: "5px 20px !important"
    }
}))