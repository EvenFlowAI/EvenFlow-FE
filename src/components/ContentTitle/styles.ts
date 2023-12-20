import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

const titleSt = {
    fontSize: 24,
    lineHeight: "29px",
    margin: 0
}

export const useStyles = makeStyles((theme: Theme) => ({
    title: {
        ...titleSt,
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            textAlign: "center"
        }
    },
    subtitle: {},
    titleContainer: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("xs")]: {
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
        [theme.breakpoints.down("xs")]: {
            display: "block"
        }
    }
}));