import {styled, Theme} from "@material-ui/core";

export const CardsWrapper = styled("div")<Theme>(({theme}) => ({
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: "18px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: '1fr',
    }
}));