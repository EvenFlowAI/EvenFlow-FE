import {styled, Theme} from "@material-ui/core";
import React from "react";

export const CardWrapper = styled(({active, selected, ...props}) => <div {...props}/>)<Theme, {
    active?: boolean,
    selected?: boolean
}>(({theme, active, selected}) => {
    return {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr 4fr 3fr 2fr",
        width: "100%",
        maxWidth: 250,
        transition: "all .2s",
        fontSize: 24,
        textAlign: "center",
        alignItems: "center",
        padding: 10,
        background: active ? '#000000' : selected ? "#DEFFDF" : "transparent",
        border: `1px solid ${active ? '#000000' : selected ? '#89E5AB' : '#DADADA'}`,
        cursor: "pointer",
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            maxWidth: 300,
            gridTemplateColumns: "1fr 3fr",
            gridTemplateRows: "1fr",
            fontSize: 18,
            ".cardIcon": {
                width: 65,
                height: 65
            }
        },
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
            [theme.breakpoints.down("sm")]: {
                position: 'absolute',
                top: 5,
                right: 5,
            }
        },
    }
});