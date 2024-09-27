import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: '16px 80px',
        "& > div:not(:last-child)": {
            marginRight: 20
        },
        [theme.breakpoints.down("mdl")]: {
            padding: 16,
            flexDirection: 'column',
            '& > div': {
                width: "100%"
            },
            '& > div:first-child': {
                marginBottom: 12,
            }
        }
    },
}));