import makeStyles from '@mui/styles/makeStyles';

const baseCellStyles = {
    backgroundColor: 'white',
    border: "none",
}

const border = '1px solid #E0E2E8';

export const useTableStyles = makeStyles(() => ({
    wrapper: {
        marginBottom: 20,
        padding: 10,
        background: 'white',
        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
    },
    headerCell: {
        ...baseCellStyles,
        color: "#9DA8B5",
        fontWeight: 'bold',
        justifyContent: 'left',
    },
    headerCellBlack: {
        width: 110,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'black',
        border: '1px solid black',
    },
    rowGrey: {
        background: '#F2F3F7',
    },
    row: {
        background: 'white',
    },
    emptyRow: {
        background: 'white',
        height: 16,
    },
    emptyCell: {
        ...baseCellStyles,
        padding: 0,
    },
    firstCellFirstRow: {
        ...baseCellStyles,
        borderTop: border,
        borderLeft: border,
    },
    firstCellLastRow: {
        ...baseCellStyles,
        borderBottom: border,
        borderLeft: border,
    },
    firstCell: {
        ...baseCellStyles,
        borderLeft: border,
    },
    lastCellFirstRow: {
        ...baseCellStyles,
        borderTop: border,
        borderRight: border,
    },
    lastCellLastRow: {
        ...baseCellStyles,
        borderRight: border,
        borderBottom: border,
    },
    lastCell: {
        ...baseCellStyles,
        borderRight: border,
    },
    cellFirstRow: {
        ...baseCellStyles,
        borderTop: border,
    },
    cellLastRow: {
        ...baseCellStyles,
        borderBottom: border,
    },
    cell: {
        ...baseCellStyles,
    },
    requestCell: {
        border:"none",
        background: "transparent",
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "flex-end",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
}));