import {styled, Theme} from "@mui/material";

export const CardsWrapper = styled("div")<Theme>(({theme}) => ({
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: "18px",
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        justifyItems: "center",
    }
}));