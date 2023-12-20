import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    titleRow: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 12,
        color: theme.palette.text.disabled,
        [theme.breakpoints.down("xs")]: {
            fontSize: 11
        }
    },
}))