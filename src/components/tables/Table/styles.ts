import { makeStyles } from 'tss-react/mui';
import {cellPadding, compactPadding, superCompactPadding} from "./constants";
import {styled, TableCell} from "@mui/material";

export type TStyleProps = {
    compact: boolean;
    smallHeaderFont: boolean;
    superCompact: boolean;
    borderHeader: boolean;
    withBorders?: boolean;
    compactBody?: boolean;
}

export const StyledTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "compact" && prop !== "smallHeaderFont" && prop !== "superCompact" && prop !== "borderHeader" && prop !== "withBorders"
})<TStyleProps>(({theme, compact, superCompact, withBorders}) => ({
    fontSize: compact ? 14 : 16,
    border: withBorders ? '1px solid #DADADA' : "none",
    // borderBottomColor: "#000000",
    padding: compact ? compactPadding : superCompact ? superCompactPadding : cellPadding,
    [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        padding: theme.spacing(1)
    }
}))

export const StyledTableHead = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "compact" && prop !== "smallHeaderFont"
        && prop !== "superCompact" && prop !== "borderHeader" && prop !== "withBorders"
        && prop !== "compactBody"
})<TStyleProps>(({theme, compact, compactBody, smallHeaderFont, superCompact, borderHeader, withBorders}) => ({
    fontSize: smallHeaderFont ? 12 : compact && !compactBody ? 14 : 16,
    border: withBorders ? '1px solid #DADADA' : "none",
    borderBottom: borderHeader ? '1px solid #DADADA' : "none",
    padding: compact && !compactBody ? compactPadding : superCompact ? superCompactPadding : cellPadding,
    fontWeight: "bold",
    color: "#9DA8B5",
    [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        padding: theme.spacing(1)
    }
}))

export const useStyles = makeStyles()(theme => ({
    root: {
        maxWidth: theme.breakpoints.values.lg,
    },
    pagination: {
        flexShrink: 0,
        width: "100%",
    },
    tableRow: {
        "&:nth-of-type(odd)": {
            background: "#FFFFFF"
        },
        "&:nth-of-type(even)": {
            background: "#F2F3F7"
        }
    },
    select: {
        background: "transparent",
        border: "none"
    }
}));