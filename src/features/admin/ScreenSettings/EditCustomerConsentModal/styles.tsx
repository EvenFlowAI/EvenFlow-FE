import {styled} from "@mui/material";

export const Label = styled("div")(({theme}) => ({
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: theme.palette.text.primary
}))