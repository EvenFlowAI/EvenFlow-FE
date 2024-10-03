import { makeStyles } from 'tss-react/mui';
import {cellPadding, compactPadding, superCompactPadding} from "./constants";
import {styled, TableCell} from "@mui/material";

export type TStyleProps = {
    compact: boolean;
    smallHeaderFont: boolean;
    superCompact: boolean;
    borderHeader: boolean;
    withBorders?: boolean;
    compactBodyPadding?: boolean;
    verticalAlign?: string;
    verticalPadding?: number;
}

export const StyledTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "compact" && prop !== "smallHeaderFont"
        && prop !== "superCompact" && prop !== "borderHeader" && prop !== "withBorders"
    && prop !== "compactBodyPadding" && prop !== "verticalAlign" && prop !== "verticalPadding"
})<TStyleProps>(({theme, compact, compactBodyPadding, verticalPadding, superCompact, withBorders}) => ({
    fontSize: 16,
    border: withBorders ? '1px solid #DADADA' : "none",
    // borderBottomColor: "#000000",
    padding: compact || compactBodyPadding ? compactPadding : superCompact ? superCompactPadding : verticalPadding ? `${verticalPadding}px 16px`: cellPadding,
    [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        padding: theme.spacing(1)
    }
}))

export const StyledTableHead = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "compact" && prop !== "smallHeaderFont"
        && prop !== "superCompact" && prop !== "borderHeader" && prop !== "withBorders" && prop !== "verticalAlign"
        && prop !== "compactBodyPadding" && prop !== "verticalPadding"
})<TStyleProps>(({theme, compact, smallHeaderFont, superCompact,
                                                          borderHeader, withBorders, verticalAlign}) => ({
    fontSize: smallHeaderFont ? 12 : 16,
    border: withBorders ? '1px solid #DADADA' : "none",
    borderBottom: borderHeader ? '1px solid #DADADA' : "none",
    padding: compact ? compactPadding : superCompact ? superCompactPadding : cellPadding,
    fontWeight: "bold",
    color: "#858585",
    [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        padding: theme.spacing(1)
    },
    verticalAlign: verticalAlign ?? 'center'
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