import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: '16px 80px',
        "& > div:not(:last-child)": {
            marginRight: 20
        }
    },
});