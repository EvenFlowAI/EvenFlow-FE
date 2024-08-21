import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    root: {
        padding: `0 ${theme.spacing(4)} ${theme.spacing(4)}`,
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        width: "100%",
        maxWidth: theme.breakpoints.values.lg,
        [theme.breakpoints.down('xl')]: {
            padding: '0 16px'
        }
    }
}));