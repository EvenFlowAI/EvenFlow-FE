import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        "& > div:first-child": {
            marginRight: 20,
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            flexDirection: "column-reverse",
            "& > div": {
                width: '100%'
            },
            "& > div:last-child": {
                marginBottom: 20,
            },
            "& > div:first-child": {
                marginRight: 0,
            },
        },
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
    },
    modalWrapper: {
        padding: "60px 88px 36px 88px",
        [theme.breakpoints.down('md')]: {
            padding: "16px",
        },
    },
    textWrapper: {
        fontWeight: 600,
        fontSize: 24,
        color: "#202021",
        marginBottom: 24,
        textAlign: "center",
        [theme.breakpoints.down('md')]: {
            fontSize: 22,
            marginBottom: 16,
        },
    }
}));