import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    panel: {
        width: "100%",
        overflowX: "auto",
        [theme.breakpoints.down("xs")]: {
            padding: `${theme.spacing(3)}px 0`
        }
    }
}));