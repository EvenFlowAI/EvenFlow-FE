import {styled} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

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

// 
export const useStyles = makeStyles()(() => ({
    select: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid #DADADA",
            '& > div > div': {
                fontSize: '1rem',
                color: '#212121',
                backgroundColor: 'transparent',
            },
        },
    },
    emptySelect: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid #DADADA",
            '& > div > div': {
                fontSize: '1rem',
            },
        }
    },
    errorSelect: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid red",
            '& > div > div': {
                fontSize: '1rem',
                color: '#ff00006b',
                opacity: 1
            }
        },
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