import makeStyles from '@mui/styles/makeStyles';
import { styled, Tooltip } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const useStyles = makeStyles(() => ({
    tableWrapper: {
    },
    wrapper: ({columnsCount}: {columnsCount: number}) => ({
        width: columnsCount > 10 ? columnsCount * 150 : 1550,
        overflowX: 'auto',
        marginTop: 16,
        borderTop: '1px solid #DADADA',
        borderLeft: '1px solid #DADADA',
        borderCollapse: 'unset',
    }),
    emptyWrapper: {
        height: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: 'bold',
        color: "#202021",
        textTransform: "uppercase",
        padding: '16px 8px',
    },
    bodyCell: {
        fontSize: 12,
        color: "#202021",
        padding: '12px 8px',
        borderRight: '1px solid #DADADA',
    },
    greyRow: {
        height: 24,
        width: "100%",
    },
    input: {
        padding: 0,
        backgroundColor: 'transparent',
        fontSize: 12,
    },
    pagination: {
        position: 'sticky',
        left: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        flexShrink: 0,
        width: "100%",
    },
    stickyLeftCell: {
        position: 'sticky',
        left: 0,
        zIndex: 1,
        fontSize: 12,
        color: "#202021",
        padding: '12px 8px',
        backgroundColor: "#F7F8FB",
        borderRight: '1px solid #DADADA',
    },
    stickyTHeadCell: {
        position: 'sticky',
        left: 0,
        zIndex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        color: "#202021",
        textTransform: "uppercase",
        backgroundColor: "#F7F8FB",
        padding: '16px 8px',
        borderRight: '1px solid #DADADA',
    },
}))

export const IconsBlock = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

export const HtmlTooltip = withStyles({
    tooltip: {
        fontSize: 12,
        color: '#202021',
        padding: 8,
        background: '#F7F8FB',
        boxShadow: "1px 1px 3px grey"
    },
    popper: {
        borderRadius: 0,
    }
})(Tooltip);