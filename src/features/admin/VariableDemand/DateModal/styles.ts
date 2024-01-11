import {styled} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

export const Date = styled("h4")(({theme}) => ({
    fontSize: 19,
    fontWeight: "normal",
    textAlign: "center",
    margin: 0,
    color: theme.palette.text.disabled
}));

export const useStyles = makeStyles(theme => ({
    low: {
        color: "#00ADB8",
        "&.Mui-checked": {
            color: "#00ADB8"
        }
    },
    average: {
        color: theme.palette.primary.main,
        "&.Mui-checked": {
            color: theme.palette.primary.main
        }
    },
    high: {
        color: theme.palette.secondary.main,
        ".Mui-checked": {
            color: theme.palette.secondary.main
        }
    }
}));
