import React from 'react';
import {styled} from "@material-ui/core";
import {IServiceCategory} from "../../../../api/types";
import {EOfferType} from "../../../../store/reducers/offers/types";

const Wrapper = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 20,
}))

const PriceValue = styled('div')(() => ({
    display: "flex",
    alignItems: 'center',
    ".previousPrice": {
        textDecoration: "line-through",
    },
    ".discount": {
        fontWeight: 700,
        color: "#008331",
    }
}))

const ExpDate = styled('div')(() => ({
    fontWeight: 700,
    color: "#008331",
}))

type TPriceProps = {
    selectedService: IServiceCategory;
}

const getOfferView = (selectedService: IServiceCategory): string | HTMLElement => {
    if (selectedService.offer?.type === EOfferType.AmountOff) {
        return `${selectedService.offer?.valueOff}% Off`
    }
    if (selectedService.offer?.type === EOfferType.PercentOff) {
        return `${selectedService.offer?.valueOff}% Off`
    }
    if (selectedService.offer?.type === EOfferType.FreeService) {
        return selectedService?.offer?.title ?? ''
    }
    return '';
}

const Price: React.FC<TPriceProps> = ({selectedService}) => {
    return (
        <Wrapper>
            <PriceValue>
                <span>Price: {selectedService.price}</span>
                <span className="discount">
                    {getOfferView(selectedService)}
                </span>
            </PriceValue>
        </Wrapper>
    );
};

export default Price;