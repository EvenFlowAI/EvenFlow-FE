import {styled} from "@mui/material";

export const Wrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
}))

export const Label = styled("span")(() => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center"
}))