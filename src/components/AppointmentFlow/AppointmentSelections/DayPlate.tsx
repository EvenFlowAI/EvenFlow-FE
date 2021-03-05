import React from 'react';
import {styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import moment from "moment";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

const DayContainer = styled("div")(({theme}) => ({
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    cursor: "pointer"
}));
const Paper = styled(SquarePaper)(({theme}) => ({
    display: "flex",
    flexGrow: 1,
    flexFlow: "column nowrap",
    padding: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center",
    minHeight: 80,
    minWidth: 80,
    cursor: "pointer",
    background: "#fff",
    transition: theme.transitions.create(["background"]),
    "&.selected": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
    },
    [theme.breakpoints.down("xs")]: {
        display: "none"
    }
}));

const Label = styled("span")({
    fontSize: 9,
});
const Price = styled("span")({
    fontWeight: "bold",
    fontSize: 25,
    "&>sup": {
        fontSize: 18
    }
});
const Date = styled("span")({
    fontSize: 13,
    textAlign: "center",
    marginBottom: 4
});
const Day = styled("span")({
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 15,
    position: "relative",
    zIndex: 1
});
const OffersCircle = styled("span")({
    width: 10,
    height: 10,
    backgroundColor: "#56D75C",
    borderRadius: 5,
    top: 0,
    right: -5,
    position: "absolute",
    zIndex: -1
});
const DayNumber = styled("span")(({theme}) => ({
    height: 32,
    width: 32,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: theme.transitions.create(["background", "color"]),
    marginTop: theme.spacing(.5),
    "&.active": {
        backgroundColor: theme.palette.primary.main,
        color: "#ffffff"
    }
}))
const Offers = styled("span")({
    color: "#76FA7B",
    fontSize: 9,
    textTransform: "uppercase",
    position: "relative",
    "&>sup": {
        content: "",
        display: "block",
        position: "absolute",
        top: -4,
        right: -6,
        width: 4,
        height: 4,
        borderRadius: 2,
        background: "#76FA7B"
    }
});

type TProps = {
    date: ParsableDate;
    offers: boolean;
    selected?: boolean;
    price: number;
    onClick: () => void;
    isXS: boolean;
}
export const DayPlate: React.FC<TProps> = ({date, isXS, offers, price, selected, onClick}) => {
    return <DayContainer onClick={onClick}>
        {!isXS ?
            <Date>{moment(date).format("MMM  D, ddd")}</Date> :
            <>
                <Day>
                    {offers ? <OffersCircle /> : null}
                    {moment(date).format("ddd")}
                </Day>
                <DayNumber className={selected ? "active" : undefined}>
                    {moment(date).format("D")}
                </DayNumber>
            </>
        }
        <Paper
            variant="outlined"
            className={selected ? "selected" : undefined}>
            <Label>Price as low as</Label>
            <Price><sup>$</sup>{price.toFixed(0)}</Price>
            {offers ? <Offers>+<strong>offers</strong><sup /></Offers> : <span className="grow" />}
        </Paper>
    </DayContainer>
};