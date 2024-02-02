import {FormControlLabel, styled} from "@material-ui/core";

export const StyledLabel = styled(FormControlLabel)({
    textTransform: 'uppercase',
    '& > span': {
        fontWeight: 'bold',
        fontSize: 10,
    }
})