import React from 'react';
import {IServiceCategory} from "../../../../../api/types";
import {getOfferView} from "./utils";
import {PriceValue, Wrapper} from "./styles";

type TPriceProps = {
    selectedService: IServiceCategory;
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