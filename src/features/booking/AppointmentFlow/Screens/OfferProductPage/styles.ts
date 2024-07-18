import {styled} from "@mui/material";

export const Description = styled('div')(() => ({
    padding: 10,
    marginBottom: 20,
    "& > p:not(:last-child)": {
        fontWeight: 600,
        color: "#828282",
    }
}))

export const PriceAndDate = styled('div')(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    fontSize: 20,
    "& .innerWrapper": {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    "& .price": {
        marginRight: 16,
    },
    "& .greenText": {
        fontWeight: 'bold',
        color: '#008331',
    },
    "& .date": {
        color: '#202021',
        fontWeight: 'bold',
        fontSize: 16
    }
}))