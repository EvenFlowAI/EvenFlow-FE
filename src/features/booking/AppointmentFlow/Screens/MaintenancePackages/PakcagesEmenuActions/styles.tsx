import {styled} from "@mui/material";

export const ButtonsRow = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    gap: "22px",
    marginTop: 20,
    "& button": {
        minWidth: 144
    },
    [`${theme.breakpoints.down('md')} and (orientation: portrait)`]: {
        flexDirection: "column",
        width: "100%",
        gap: "12px",
        "& button": {
            width: "100%"
        }
    }
}));