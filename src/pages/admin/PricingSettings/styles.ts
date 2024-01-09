import {FormControlLabel, styled} from "@material-ui/core";

export const ControlLabel = styled(FormControlLabel)({
    textTransform: "uppercase",
    "& .MuiFormControlLabel-label": {
        fontWeight: "bold"
    }
})

export const ButtonsWrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-end"
})