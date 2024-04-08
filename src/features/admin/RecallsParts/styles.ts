import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        marginRight: 10
    },
    button: {
        marginLeft: 20
    }
}));