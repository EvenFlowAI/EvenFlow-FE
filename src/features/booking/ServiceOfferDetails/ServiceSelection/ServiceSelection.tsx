import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IServiceOffer} from "../../../../store/reducers/appointmentFrameReducer/types";
import {loadServiceOffers, setValueServicePartial} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {OffersContainer} from "../../../../components/styled/OffersContainer";
import {OfferCardWrapper} from "../../../../components/styled/OfferCardWrapper";
import {ServiceTitle} from "../../../../components/styled/ServiceTitle";
import {ChangeButton} from "../../../../components/styled/ChangeButton";
import {OfferPageWrapper} from "../../../../components/styled/OfferPageWrapper";
import {SubTitle} from "../../../../components/styled/SubTitle";
import {CarName} from "../../../../components/styled/CarName";
import {Price, SelectButton} from "./styles";

type TServiceSelectionProps = {
    onNext: () => void;
    onBack: () => void;
}

const ServiceSelection: React.FC<React.PropsWithChildren<React.PropsWithChildren<TServiceSelectionProps>>> = ({onNext, onBack}) => {
    const {valueService, serviceOffers, offersLoading} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();

    useEffect(() => {
        const year = valueService?.year?.year;
        const seriesId = valueService?.series?.id;
        const modelId = valueService?.model?.id;
        if (year && seriesId && modelId && scProfile) dispatch(loadServiceOffers(+year, seriesId, modelId, scProfile.id));
    }, [valueService])

    const onSelectClick = (item: IServiceOffer) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        await dispatch(setValueServicePartial({selectedService: item}));
        onNext();
    };

    return (
        <OfferPageWrapper>
            <CarName>{valueService?.year?.year} {valueService?.series?.name} {valueService?.model?.name}</CarName>
            <ChangeButton onClick={onBack} variant="text">Change Vehicle</ChangeButton>
            <SubTitle>Select Service</SubTitle>
            <OffersContainer>
                {offersLoading
                    ? <Loading/>
                    : serviceOffers.map(service => {
                    return <OfferCardWrapper>
                        <ServiceTitle>{service.name}</ServiceTitle>
                        <div  className="image" style={{backgroundImage: `url(${service.imagePath})`}}/>
                        <div className="buttonsWrapper">
                            <SelectButton onClick={onSelectClick(service)}>Select</SelectButton>
                            <Price>$ {service.price}</Price>
                        </div>
                    </OfferCardWrapper>
                })}
            </OffersContainer>
        </OfferPageWrapper>
    );
};

export default ServiceSelection;