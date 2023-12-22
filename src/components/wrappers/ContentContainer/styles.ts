import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        padding: `0 ${theme.spacing(4)}px ${theme.spacing(4)}px`,
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        width: "100%",
        maxWidth: theme.breakpoints.values.lg,
    }
}));