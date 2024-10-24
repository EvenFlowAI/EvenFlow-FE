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
            flexDirection: 'column-reverse',
            '& > div': {
                width: "100%"
            },
            '& > div:last-child': {
                marginBottom: 12,
            },
            "& > div:first-child": {
                marginRight: 0
            },
        }
    },
}));