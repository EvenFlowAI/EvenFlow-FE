import {styled} from "@mui/material";

export const LinksWrapper = styled("div")({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 9,
    "& > div:first-child": {
        marginBottom: 35
    }
})