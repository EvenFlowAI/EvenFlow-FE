import React from "react";
import {EOfferType, TOffer} from "./mock";
import {styled} from "@material-ui/core";
import {Build} from "@material-ui/icons";

const Offer = styled("div")(({theme}) => ({
    padding: theme.spacing(.5),
    backgroundColor: "#56D75C",
    color: "#fff",
    borderRadius: 2,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    lineHeight: "12px",
    fontWeight: "bold"
}));
const Uppercase = styled("span")({
    textTransform: "uppercase"
});
const BuildIcon = styled(Build)({
    fontSize: 12,
    verticalAlign: "bottom"
})
export const OfferChip: React.FC<{offer: TOffer} & React.HTMLAttributes<HTMLDivElement>> = ({offer, children, ...attrs}) => {
    const getOfferValue = () => {
        switch (offer.type) {
            case EOfferType.Amount:
                return `$${offer.value} off`;
            case EOfferType.Free:
                return <span>Free <BuildIcon /></span>;
            case EOfferType.Percentage:
                return `${offer.value}% off`;
        }
    }
    return <Offer {...attrs}>
        {getOfferValue()}
    </Offer>
}

export const CalendarOfferChip = styled(OfferChip)({
    fontSize: 9,
    borderRadius: 0
});
export const ShortWaitChip: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, ...props}) => {
    return <Offer {...props}>
        <Uppercase>Shorter</Uppercase>
        <Uppercase>Wait time</Uppercase>
    </Offer>
}
export const CalendarWaitChip = styled(ShortWaitChip)({
    fontSize: 9,
    borderRadius: 0
})

export const LoanerCarChip = () => {
    return <Offer>
        <Uppercase>Loaner car</Uppercase>
    </Offer>
}