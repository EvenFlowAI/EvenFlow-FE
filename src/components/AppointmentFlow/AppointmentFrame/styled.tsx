import {styled, Theme} from "@material-ui/core";

export const CardsWrapper = styled("div")({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    gap: "18px",
});

export const CardWrapper = styled("div")<Theme, {active?: boolean}>({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr",
    width: "100%",
    transition: "all .2s",
    background: ({active}) => active ? '#000000' : "transparent",
    color: ({active}) => active ? "#FFFFFF" : "#252733",
    border: ({active}) => `1px solid ${active ? '#000000' : '#DADADA'}`,
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    cursor: "pointer",
});