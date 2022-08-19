import {styled, Theme} from "@material-ui/core";

export const CardsWrapper = styled("div")(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: "18px",
}));

export const CardWrapper = styled("div")<Theme>(({theme}) => {
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
        "& .infoIcon": {
        display: 'flex',
            justifyContent: 'flex-end',
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
    }
});