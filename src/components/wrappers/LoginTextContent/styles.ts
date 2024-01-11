import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: 30,
        padding: "0 60px",
        [theme.breakpoints.down('md')]: {
            padding: "0 30px"
        },
        [theme.breakpoints.down('sm')]: {
            padding: `0 ${theme.spacing(1)}`
        }
    }
}));