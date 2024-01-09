import {styled} from "@material-ui/core";

export const DaySelectorWrapper = styled('div')(({theme}) => ({
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "12px",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        marginTop: 0,
        gap: "10px",
    }
}));