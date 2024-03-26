import { makeStyles } from 'tss-react/mui';
import {styled, TableCell} from "@mui/material";

export const useStyles = makeStyles()(() => ({
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
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
}));

export const THeadCell = styled(TableCell)({
    padding: 16,
    fontSize: 16,
    fontWeight: 700,
})

export const THeadCellWithSub = styled(TableCell)({
    padding: 0,
    paddingTop: 16,
    fontSize: 16,
    fontWeight: 700,
    '& > div': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '& > div:first-child': {
        borderBottom: '1px solid #DADADA',
    }
})

export const TCellWithSub = styled(TableCell)({
    '& > div': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 16px',
        '&:first-child': {
            borderBottom: '1px solid #DADADA',
        }
    },
})

export const SubCellsWrapper = styled("div")({
    display: 'flex',
    justifyContent: "space-between",
    alignItems: 'center',
    color: "#858585",
    fontSize: 16,
    fontWeight: 700,
    '& > div': {
        width: "100%",
        display: 'flex',
        justifyContent: "space-evenly",
        alignItems: 'center',
        padding: '8px 16px',
        '&:first-child': {
            borderRight: '1px solid #DADADA'
        }
    },
})

export const SubCellTitle = styled("div")({
    paddingBottom: 16,
})