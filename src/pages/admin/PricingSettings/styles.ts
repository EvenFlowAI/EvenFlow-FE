import {FormControlLabel, styled} from "@mui/material";

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