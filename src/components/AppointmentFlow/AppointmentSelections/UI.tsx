import React from "react";
import {EOfferType, TOffer} from "./mock";
import {styled} from "@material-ui/core";
import {Build} from "@material-ui/icons";

type TOfferProps = {
    white?: boolean;
}

const Offer = styled(
    ({white, ...props}: TOfferProps & React.HTMLAttributes<HTMLDivElement>) => <div {...props} />
)({
    padding: 4,
    backgroundColor: (props: TOfferProps) => props.white ? "#fff" : "#56D75C",
    color: (props: TOfferProps) => props.white ? "inherit" : "#fff",
    borderRadius: 2,
    border: (props: TOfferProps) => props.white ? "1px solid #e0e0e0" : undefined,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    lineHeight: "12px",
    fontWeight: "bold"
});
const Uppercase = styled("span")({
    textTransform: "uppercase"
});
const BuildIcon = styled(Build)({
    fontSize: 12,
    verticalAlign: "bottom"
})
export const OfferChip: React.FC<{offer: TOffer, white?: boolean} & React.HTMLAttributes<HTMLDivElement>> = ({offer, children, ...attrs}) => {
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
    borderRadius: 0
});
export const ShortWaitChip: React.FC<TOfferProps&React.HTMLAttributes<HTMLDivElement>> = ({children, ...props}) => {
    return <Offer {...props}>
        <Uppercase>Shorter</Uppercase>
        <Uppercase>Wait time</Uppercase>
    </Offer>
}
export const CalendarWaitChip = styled(ShortWaitChip)({
    borderRadius: 0
})

export const LoanerCarChip: React.FC<TOfferProps&React.HTMLAttributes<HTMLDivElement>> = ({children, ...props}) => {
    return <Offer {...props}>
        <Uppercase>Loaner car</Uppercase>
    </Offer>
}