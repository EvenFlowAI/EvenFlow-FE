import {styled} from "@mui/material";

export const FiltersWrapper = styled('div')(({theme}) => ({
    width: '100%',
    display: "flex",
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
    '& > div': {
        width: '100%',
    },
    '& > button': {
        flexShrink: 0,
        padding: '9px 16px'
    },
    [theme.breakpoints.down('mdl')]: {
        flexDirection: "column",
        alignItems: 'flex-start',
        '& > div': {
            marginBottom: 10
        },
    },
    [theme.breakpoints.up('mdl')]: {
        '& > div:not(last-child)': {
            marginRight: 20
        },
    }
}));