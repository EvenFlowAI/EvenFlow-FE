import {styled} from "@mui/material";

export const OffersContainer = styled('div')(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    }
}))