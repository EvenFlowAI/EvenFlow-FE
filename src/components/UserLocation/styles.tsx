import {styled} from "@mui/material";
import {makeStyles} from 'tss-react/mui';

export const SelectWrapper = styled('div')(({theme}) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "47% 47%",
    justifyContent: 'space-between',
    "& .label": {
        fontWeight: 700,
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "100%",
        gap: "20px",
    }
}));

export const useAutocompleteStyles = makeStyles<{error: boolean}>()((_theme, { error }) =>({
    root: {
        "& input::placeholder": {
            color: error ? "red" : 'black'
        },
        "& > label": {
            textTransform: "uppercase",
            fontWeight: 'bold',
            color: "#000000"
        }
    },
    popupIndicator: {
        marginRight: 8
    },
}));