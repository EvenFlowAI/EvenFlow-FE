import { makeStyles } from 'tss-react/mui';

// 
export const useStyles = makeStyles()({
    paper: {
        height: "100%",
        borderRadius: 0,
        padding: 20,
        position: "relative"
    },
    title: {
        fontSize: 16,
        textTransform: "uppercase",
        margin: 0
    },
    value: {
        marginTop: 20,
        fontSize: 48,
        fontWeight: "bold",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    helperText: {
        fontSize: 14,
        lineHeight: "17px",
        fontWeight: 300,
        marginTop: 73,
    },
    label: {
        fontWeight: 300,
        fontSize: 19,
        marginTop: 16
    },
    edit: {
        position: "absolute",
        top: 10,
        right: 6,
        textTransform: "none",
        fontSize: 16
    }
});
