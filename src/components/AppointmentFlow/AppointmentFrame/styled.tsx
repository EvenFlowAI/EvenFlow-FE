import {styled, Theme} from "@material-ui/core";

export const CardsWrapper = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    gap: "18px",
    [theme.breakpoints.down('sm')]: {
        flexWrap: "wrap"
    }
}));

export const CardWrapper = styled("div")<Theme, {active?: boolean, selected?: boolean}>(({theme, active, selected}) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr",
    width: "100%",
    maxWidth: 250,
    transition: "all .2s",
    background: active ? '#000000' : selected ? "#DEFFDF" : "transparent",
    // color: active ? "#FFFFFF" : "#252733",
    border: `1px solid ${active ? '#000000' : selected ? '#89E5AB' : '#DADADA'}`,
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    cursor: "pointer",
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr 3fr",
        gridTemplateRows: "1fr",
        fontSize: 18,
        "& svg": {
            width: 65,
            height: 65
        }
    }
}));