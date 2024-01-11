import withStyles from '@mui/styles/withStyles';

import {LoadingButton} from "../buttons/LoadingButton/LoadingButton";

export const LoginButton = withStyles(theme => ({
    wrapper: {marginTop: 40},
    root: {
        padding: theme.spacing(2)
    }
}))(LoadingButton);