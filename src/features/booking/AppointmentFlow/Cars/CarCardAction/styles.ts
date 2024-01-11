import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    wrapper: {
        fontSize: 20,
        width: "100%",
        "&>div:first-child": {
            width: "100%",
            [theme.breakpoints.down('sm')]: {
                width: 200,
            }
        },
        "& button:first-child": {
            flexGrow: 1
        }
    }
}))