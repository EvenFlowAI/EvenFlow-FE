import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";

// 
export const useStyles = makeStyles()(() => ({
    headerWrapper: {
        color: "#202021",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 700,
    },
    name: {
        fontSize: 16,
        fontWeight: 600
    },
    link: {
        color: "#142EA1"
    },
    departmentHours: {
        fontWeight: 600,
        fontSize: 14,
        textTransform: 'uppercase'
    },
    label: {
        fontSize: 14,
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    data: {
        fontSize: 14,
        textTransform: 'uppercase'
    },
    disclaimer: {
        border: '1px solid #DADADA',
        padding: 12,
    },
    disclaimerTitle: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: 8
    },
    disclaimerText: {
        fontSize: 10,
    },
    greyDetails: {
        color: "#828282",
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    totalDue: {
        fontSize: 16,
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    headerCell: {
        fontWeight: 700,
        fontSize: 20,
        textTransform: 'uppercase',
        borderTop: '1px solid #DADADA',
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
    },
    cell: {
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
    },
    greyRow: {
        width: "100%",
        background: '#DADADA',
        height: 24,
        border: '1px solid #DADADA',
    },
    totalRow: {
        borderBottom: '1px solid #202021',
    },
    totalCell: {
        fontWeight: 700,
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
        borderBottom: '1px solid #202021',
    },
    lastRowCell: {
        borderLeft: '1px solid #DADADA',
        borderRight: '1px solid #DADADA',
        borderBottom: '1px solid #202021',
    },
    detailsRow: {
        marginBottom: 10
    }
}));

export const Wrapper = styled('div')({
    display: "flex",
    justifyContent: "center",
    padding: 36,
    background: "#E5E5E5"
})

export const Paper = styled('div')({
    width: '60%',
    padding: 28,
    border: '1px solid #DADADA',
    background: "#FFFFFF",
})