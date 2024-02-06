import {styled} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

export const PickUpSlotsWrapper = styled('div')(() => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px 12px",
    alignItems: "center",
    justifyContent: "stretch",
}));

//
export const useStyles = makeStyles()(theme => ({
    wrapper: {
        maxHeight: '40vh',
        overflowY: "auto",
        [theme.breakpoints.down('sm')]: {
            maxHeight: '30vh',
        }
    }
}));