import {styled} from "@mui/material";

export const Label = styled("div")(({theme}) => ({
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: theme.palette.text.primary
}))

export const SectionTitle = styled('div')({
    fontSize: 16,
    fontWeight: 700,
    color: "#858585",
    textTransform: "uppercase",
})