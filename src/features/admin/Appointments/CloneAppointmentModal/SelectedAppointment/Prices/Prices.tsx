import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {loadRoundPriceSetting} from "../../../../../../store/reducers/pricingSettings/actions";
import {useSCs} from "../../../../../../hooks/useSCs/useSCs";

type TPricesProps = {
    ancillaryPrice: number;
    price: number;
}

const Prices: React.FC<React.PropsWithChildren<React.PropsWithChildren<TPricesProps>>> = ({ancillaryPrice, price}) => {
    const {roundPrice} = useSelector((state: RootState) => state.pricingSettings);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        selectedSC && dispatch(loadRoundPriceSetting(selectedSC.id))
    }, [selectedSC])

    return <div className="price">
        ${roundPrice ? price + ancillaryPrice : (price + ancillaryPrice).toFixed(2)}
    </div>
};

export default Prices;