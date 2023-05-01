import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

type TPricesProps = {
    ancillaryPrice: number;
    price: number;
}

const Prices: React.FC<TPricesProps> = ({ancillaryPrice, price}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    return <div className="price">
        ${scProfile?.isRoundPrice ? price + ancillaryPrice : (price + ancillaryPrice).toFixed(2)}
    </div>
};

export default Prices;