import {styled} from "@material-ui/core";

export const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
        marginTop: 8,
        textAlign: "left",
    }
}))