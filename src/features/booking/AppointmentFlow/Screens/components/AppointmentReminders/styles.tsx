import {FormControlLabel, styled} from "@mui/material";

export const StyledLabel = styled(FormControlLabel)({
    textTransform: 'uppercase',
    '& > span': {
        fontWeight: 'bold',
        fontSize: 10,
    }
})