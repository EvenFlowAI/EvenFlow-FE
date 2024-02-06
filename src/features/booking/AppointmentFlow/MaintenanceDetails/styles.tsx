import {styled} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

export const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "1fr"
    }
}));

// 
export const useStyles = makeStyles()(() => ({
    vinWrapper: {
        '& > label': {
            textTransform: 'none',
            fontSize: 14,
            color: "#142EA1",
            fontWeight: "normal",
        }
    }
}));