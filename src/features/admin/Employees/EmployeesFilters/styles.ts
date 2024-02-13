import {styled} from "@mui/material";

export const FiltersWrapper = styled('div')({
    width: '100%',
    display: "flex",
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
    '& > div': {
        width: '100%',
    },
    '& > div:not(last-child)': {
        marginRight: 20
    },
    '& > button': {
        flexShrink: 0,
        padding: '9px 16px'
    }
});