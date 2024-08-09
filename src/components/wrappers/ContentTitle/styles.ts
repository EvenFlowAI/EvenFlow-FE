import { makeStyles } from 'tss-react/mui';
import {Theme} from "@mui/material";

const titleSt = {
    fontSize: 24,
    lineHeight: "29px",
    margin: 0
}

// 
export const useStyles = makeStyles()((theme: Theme) => ({
    title: {
        ...titleSt,
        fontWeight: "bold",
        [theme.breakpoints.down('sm')]: {
            textAlign: "center"
        }
    },
    subtitle: {},
    titleContainer: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(2)
        }
    },
    rootTitle: {
        ...titleSt,
        "&>a": {
            fontWeight: "normal",
            textDecoration: "none",
            color: theme.palette.text.primary,
            "&:hover": {
                textDecoration: "underline"
            }
        },
        // [theme.breakpoints.down('sm')]: {
        //     display: "block"
        // }
    }
}));