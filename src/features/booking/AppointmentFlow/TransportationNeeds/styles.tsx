import {styled} from "@material-ui/core";

export const TransportationsWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

export const TextWrapper = styled('div')(() => ({
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: '20px 40px'
}))