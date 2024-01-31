import { makeStyles } from 'tss-react/mui';

// 
export const useStyles = makeStyles()(theme =>({
    message: {
        fontSize: 14,
        [theme.breakpoints.down('xl')]: {
            fontSize: 11
        }
    },
    rowWrapper: {
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(2)
        }
    }
}));