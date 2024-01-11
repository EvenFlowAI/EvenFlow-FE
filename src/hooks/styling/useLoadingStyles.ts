import makeStyles from '@mui/styles/makeStyles';

export const useLoadingStyles = makeStyles(theme => ({
    wrapper: {
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        }
    }
}))