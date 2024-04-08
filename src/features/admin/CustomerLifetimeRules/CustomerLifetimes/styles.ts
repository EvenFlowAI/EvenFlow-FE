import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(theme => ({
    group: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-end",
        "&>*:nth-child(2)": {
            flexGrow: 0,
            padding: 10
        },
        "&>*": {
            flexGrow: 1,
        },

        justifyContent: "space-between"
    },
    label: {
        color: theme.palette.text.primary,
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase"
    }
}));