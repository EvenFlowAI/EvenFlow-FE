import {styled} from "@mui/material";

export const ConsultantsWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gridGap: "20px",
    width: "100%",
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "1fr 1fr",
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr",
    }
}));