import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    label: {
        "& .MuiFormControlLabel-label": {
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    },
    spacer: {
        padding: 12
    },
    preview: {
        border: `1px solid ${theme.palette.text.primary}`,
        textAlign: "center",
        padding: 10,
        fontSize: 16,
        fontWeight: "bold"
    }
}));