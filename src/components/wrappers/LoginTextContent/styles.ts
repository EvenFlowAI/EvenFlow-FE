import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: 30,
        padding: "0 60px",
        [theme.breakpoints.down("sm")]: {
            padding: "0 30px"
        },
        [theme.breakpoints.down("xs")]: {
            padding: `0 ${theme.spacing(1)}`
        }
    }
}));