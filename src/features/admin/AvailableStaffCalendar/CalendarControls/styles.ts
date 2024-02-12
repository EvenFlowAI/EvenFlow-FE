import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(theme => ({
    controls: {
        [theme.breakpoints.down('sm')]: {
            textAlign: "center"
        }
    },
    controlButton: {
        borderRadius: 0,
        marginRight: 11,
        padding: 5,
        minWidth: 30,
    },
    controlDay: {
        padding: "5px 20px !important"
    }
}));