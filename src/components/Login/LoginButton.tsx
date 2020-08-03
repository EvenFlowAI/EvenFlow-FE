import {withStyles} from "@material-ui/core";
import {LoadingButton} from "../UI/Button";

export const LoginButton = withStyles(theme => ({
    wrapper: {marginTop: 40},
    root: {
        padding: theme.spacing(2)
    }
}))(LoadingButton);