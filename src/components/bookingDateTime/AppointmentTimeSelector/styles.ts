import {styled} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

export const TimeSlotsWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "20px 12px",
    justifyContent: "center",
    fontSize: 14,
    "&>div": {
        flexGrow: 1
    },
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: "repeat(5, 1fr)"
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "repeat(4, 1fr)"
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "repeat(2, 1fr)"
    }
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