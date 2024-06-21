import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    controls: {
        [theme.breakpoints.down('sm')]: {
            textAlign: "center"
        }
    },
    controlButton: {
        padding: 5,
        minWidth: 24,
    },
    controlDay: {
        minWidth: 120,
    }
}));