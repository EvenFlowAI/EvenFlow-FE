import {makeStyles} from "@material-ui/core/styles";

export const useLoadingStyles = makeStyles(theme => ({
    wrapper: {
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    }
}))