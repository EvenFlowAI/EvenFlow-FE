import {styled} from "@material-ui/core";

export const ButtonsRow = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "22px",
    marginTop: 20,
    "& button": {
        minWidth: 144
    },
    [theme.breakpoints.down('xs')]: {
        flexDirection: "row",
        width: "100%",
        gap: "12px",
        "& button": {
            width: "100%"
        }
    }
}));