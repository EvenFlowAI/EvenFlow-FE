import {styled} from "@material-ui/core";

export const Container = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "100%",
    padding: 20,
    maxWidth: 1280,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
        padding: 0,
    },
}));