import {FormControlLabel, FormGroup, styled} from "@material-ui/core";

export const FlexGroup = styled(FormGroup)({
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
})

export const StyledLabel = styled(FormControlLabel)({
    textTransform: 'uppercase',
    '& > span': {
        fontWeight: 'bold',
        fontSize: 10,
    }
})