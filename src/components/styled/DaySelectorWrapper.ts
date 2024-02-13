import {styled} from "@mui/material";

export const DaySelectorWrapper = styled('div')(({theme}) => ({
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "12px",
    width: "100%",
    [theme.breakpoints.down('md')]: {
        marginTop: 0,
        gap: "10px",
    }
}));