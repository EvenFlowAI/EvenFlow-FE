import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    headCell: {
        fontSize: 12,
        fontWeight: 700,
        color: "#9FA2B4",
        textTransform: 'uppercase',
        borderTop: '1px solid #D9D9D9',
        borderBottom: '1px solid #D9D9D9',
        padding: '18px 36px',
    },
    cell: {
        fontSize: 16
    },
    row: {
        borderRight: "1px solid #D9D9D9 !important"
    },
    rowTop: {
        borderRight: "1px solid #D9D9D9 !important",
        borderTop: "1px solid #D9D9D9 !important"
    },
})