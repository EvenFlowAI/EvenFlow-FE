import {makeStyles} from "tss-react/mui";

export const useTimeSelectorStyles = makeStyles()(theme => ({
    wrapper: {
        maxHeight: '40vh',
        overflowY: "auto",
        [theme.breakpoints.down('sm')]: {
            maxHeight: '30vh',
        }
    },
    titleWrapper: {
        display: 'flex',
        gap: 34,
        alignItems: 'center',
        fontSize: 16,
    },
    title: {
        textTransform: 'uppercase'
    },
    boldText: {
        textTransform: 'uppercase',
        fontWeight: 700,
    }
}));