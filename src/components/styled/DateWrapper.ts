import {styled} from "@mui/material";

export const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down('md')]: {
        marginTop: 8,
        textAlign: "left",
    }
}))