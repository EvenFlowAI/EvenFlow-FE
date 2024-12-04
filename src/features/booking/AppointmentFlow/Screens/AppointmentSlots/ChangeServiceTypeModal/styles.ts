import {makeStyles} from "tss-react/mui";

export const useStyles = makeStyles()({
    textWrapper: {
        fontSize: 24,
        fontWeight: 600,
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        textTransform: 'uppercase',
        fontWeight: 700
    },
    selectWrapper: {
        width: "50%"
    }
})