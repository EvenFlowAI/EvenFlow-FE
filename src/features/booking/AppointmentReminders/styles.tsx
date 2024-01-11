import {FormGroup, styled} from "@mui/material";

export const FlexGroup = styled(FormGroup)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& label": {
        marginRight: 32
    }
})