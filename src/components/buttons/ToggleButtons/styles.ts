import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        width: "100%"
    },
    label: {
        textTransform: "uppercase",
        marginBottom: theme.spacing(.5),
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    button: {
        width: "100%",
        lineHeight: "16px",
        transition: theme.transitions.create(["background"]),
        "&.Mui-selected": {
            background: theme.palette.primary.main,
            color: theme.palette.common.white,
            "&:hover": {
                background: theme.palette.primary.dark
            }
        },
    },
}));