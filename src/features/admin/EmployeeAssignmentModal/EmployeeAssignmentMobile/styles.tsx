import {Grid, styled} from "@mui/material";
import {DialogActions} from "../../../../components/modals/BaseModal/BaseModal";

export const StyledGrid = styled(Grid)({
    padding: '16px 12px',
    fontWeight: 700,
    fontSize: 16,
    border: '1px solid #DADADA',
    borderBottomWidth: 0
})

export const ServiceBook = styled(Grid)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
    fontSize: 16,
    padding: '22px 12px',
    border: '1px solid #DADADA',
    borderBottomWidth: 0
})

export const SmallGreyGrid = styled(Grid)({
    padding: '8px 12px',
    fontWeight: 700,
    color: "#858585",
    fontSize: 14,
    border: '1px solid #DADADA',
    borderBottomWidth: 0
})

export const StyledActions = styled(DialogActions)(({theme}) => ({
    [theme.breakpoints.down('mdl')]: {
        justifyContent: 'space-around',
        padding: '10p 16px 16px 16px'
    }
}))

