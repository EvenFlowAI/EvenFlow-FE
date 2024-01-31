import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";
import {TStyleProps} from "./types";

export const ZoneContainer = styled("div")<TStyleProps>(({theme, isSelected}) => ({
    display: 'grid',
    gridTemplateColumns: '2fr 3fr',
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 1,
    border: isSelected ? '1px solid #2F80ED' : '1px solid #DADADA',
    backgroundColor: "#FFFFFF",
    fontSize: 14,
}))

// 
export const useStyles = makeStyles()(() => ({
    zoneBox: {
        display: "flex",
        alignItems: 'center',
        backgroundColor: "#F2F3F7",
        border: '1px solid #DADADA',
        borderRadius: 2,
        paddingRight: 11,
        marginRight: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: "#252733",

    },
    codesContainer: {
        minHeight: 45,
        display: "grid",
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        padding: 8,
        border: "2px solid #DADADA",
        borderRadius: 2,
        backgroundColor: "#F2F3F7",
    },
    icon: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        color: "grey",
        backgroundColor: 'white',
        cursor: 'pointer',
    }
}));

export const ZipCode = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: "#7898FF",
    borderRadius: 4,
    padding: '2px 6px',
    color: '#FFFFFF',
})