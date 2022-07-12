import {styled, Theme} from "@material-ui/core";

export const CardsWrapper = styled("div")(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    // display: "flex",
    // alignItems: "stretch",
    // justifyContent: "center",
    gap: "18px",
    // flexWrap: "wrap",
    // [theme.breakpoints.down('sm')]: {
    //     flexWrap: "wrap"
    // }
}));

export const CardWrapper = styled("div")<Theme, {activeNow?: boolean, selected?: boolean,}>(({theme, activeNow, selected}) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "3fr 2fr 1fr",
    width: "100%",
    maxWidth: 200,
    transition: "all .2s",
    background: activeNow ? '#000000' : selected ? "#DEFFDF" : "transparent",
    // color: active ? "#FFFFFF" : "#252733",
    border: `1px solid ${activeNow ? '#000000' : selected ? '#89E5AB' : '#DADADA'}`,
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    cursor: "pointer",
    "& .priceWrapper": {
        height: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: "0 12px",
        [theme.breakpoints.down('sm')]: {
            gridColumn: "1/3",
        }
    },
    "& .price": {
        color: "#27AE60",
        fontSize: 20,
        fontWeight: "bold",
    },
    "& .text": {
        color: "#727273",
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: "Proxima Nova",
        textTransform: "uppercase",
    },
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