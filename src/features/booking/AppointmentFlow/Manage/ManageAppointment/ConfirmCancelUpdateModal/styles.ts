import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        padding: '16px 80px',
        gap: 12,
        "& > div:not(:last-child)": {
            marginBottom: 12
        },
        [theme.breakpoints.down("mdl")]:{
            padding: '16px',
        }
    },
    textButton: {
        color: "#142EA1",
        marginBottom: 12
    }
}));
