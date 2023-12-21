import {styled} from "@material-ui/core";

export const OffersContainer = styled('div')(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
    [theme.breakpoints.down("md")]: {
        gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: '1fr',
    }
}))