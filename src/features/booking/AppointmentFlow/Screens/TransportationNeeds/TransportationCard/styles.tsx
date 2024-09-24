import {styled} from "@mui/material";
import React from "react";
import theme from "../../../../../../theme/theme";

export const CardWrapper = styled("div")<{
    active?: boolean,
    selected?: boolean
}>(({theme, active, selected}) => {
    return {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: '1fr 1fr',
        minHeight: 260,
        maxWidth: 250,
        transition: "all .2s",
        fontSize: 24,
        textAlign: "center",
        alignItems: 'center',
        padding: '20px 17px',
        background: active ? '#000000' : selected ? "#DEFFDF" : "transparent",
        border: `1px solid ${active ? '#000000' : selected ? '#89E5AB' : '#DADADA'}`,
        cursor: "pointer",
        [theme.breakpoints.down('mdl')]: {
            position: 'relative',
            minHeight: 0,
            maxWidth: '100%',
            gridTemplateColumns: "80px 1fr",
            gridTemplateRows: "1fr",
            fontSize: 18,
            padding: '8px 12px',
            gap: 8,
            ".cardIcon": {
                width: 78,
                height: 78
            }
        },
        "& .priceWrapper": {
            height: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: "0 12px",
            [theme.breakpoints.down('md')]: {
                gridColumn: "1/3",
            }
        },
        "& .price": {
            color: active ? "#FFFFFF" : "#202021",
            fontSize: 20,
            fontWeight: "bold",
        },
        "& .bluePrice": {
            color: "#142EA1",
            fontSize: 20,
            fontWeight: "bold",
        },
        "& .blueStrikePrice": {
            color: "#142EA1",
            fontSize: 20,
            fontWeight: "bold",
            textDecoration: 'line-through',
        },
        "& .expiringDate": {
            display: 'flex',
            justifyContent: 'flex-end',
            color: "#202021",
            fontWeight: 'bold',
            fontSize: 9,
        },
        "& .text": {
            color: active ? "#DADADA" : "#828282",
            fontSize: 11,
            fontWeight: "bold",
            fontFamily: "Proxima Nova",
            textTransform: "uppercase",
        },
        "& .infoIcon": {
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.down('md')]: {
                position: 'absolute',
                top: 5,
                right: 5,
            }
        },
    };
});

export const NoIcon = styled('div')({
    width: '100%',
    minHeight: 105,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: "#DADADA",
    fontWeight: 'bold',
    fontSize: 32,
    padding: '10%',
    backgroundColor: "#F1F1F1",
    [`${theme.breakpoints.down('md')} and (orientation: portrait)`]: {
        width: 224,
        height: 112,
        maxWidth: '90%'
    },
    [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
        padding: '7%'
    },
})