import {styled} from "@mui/material";

export const Description = styled('div')(() => ({
    padding: 10,
    marginBottom: 20,
    "& > p:not(:last-child)": {
        fontWeight: 600,
        color: "#828282",
    }
}))

export const Price = styled('div')(() => ({
    fontSize: 20,
}))