import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    panel: {
        width: "100%",
        overflowX: "auto",
        [theme.breakpoints.down('sm')]: {
            padding: `${theme.spacing(3)} 0`
        }
    }
}));