import {styled} from "@material-ui/core";

export const OfferPageWrapper = styled('div')(({theme}) => ({
    minWidth: '50vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
    border: '1px solid #DADADA',
    [theme.breakpoints.down("md")]: {
        padding: 30,
    },
    [theme.breakpoints.down("sm")]: {
        padding: 20,
    }
}))