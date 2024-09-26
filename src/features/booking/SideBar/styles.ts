import {styled} from "@mui/material";

export const Wrapper = styled('ul')(({theme}) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "stretch",
    justifyContent: "center",
    "& button": {
        justifyContent: "flex-start",
        textAlign: "left",
        fontSize: 18,
        textTransform: "none"
    },
    [theme.breakpoints.down('mdl')]: {
        marginBottom: "auto",
        alignSelf: 'flex-start'
    }
}));

export const Index = styled('span')({
    fontSize: 32,
    display: "inline-block",
    paddingRight: 8,
    minWidth: 28
});