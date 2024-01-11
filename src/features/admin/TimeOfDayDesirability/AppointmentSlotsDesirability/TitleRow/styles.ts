import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
    titleRow: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 12,
        color: theme.palette.text.disabled,
        [theme.breakpoints.down('sm')]: {
            fontSize: 11
        }
    },
}))