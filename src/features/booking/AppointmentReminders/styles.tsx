import {FormGroup, styled} from "@material-ui/core";

export const FlexGroup = styled(FormGroup)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& label": {
        marginRight: 32
    }
})