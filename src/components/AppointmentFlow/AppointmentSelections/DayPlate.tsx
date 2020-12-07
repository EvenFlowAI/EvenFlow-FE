import React from 'react';
import {styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import moment from "moment";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

const DayContainer = styled("div")(({theme}) => ({
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap"
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
    fontSize: 14,
    textTransform: "uppercase",
    textAlign: "center"
});
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
}
export const DayPlate: React.FC<TProps> = ({date, offers, price, selected, onClick}) => {
    return <DayContainer>
        <Date>{moment(date).format("D, ddd")}</Date>
        <Paper
            variant="outlined"
            onClick={onClick}
            className={selected ? "selected" : undefined}>
            <Label>Price as low as</Label>
            <Price><sup>$</sup>{price.toFixed(0)}</Price>
            {offers ? <Offers>+<strong>offers</strong><sup /></Offers> : <span className="grow" />}
        </Paper>
    </DayContainer>
};