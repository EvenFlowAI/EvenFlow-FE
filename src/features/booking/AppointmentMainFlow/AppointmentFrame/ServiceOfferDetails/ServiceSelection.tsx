import React, {useEffect} from 'react';
import {Button, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {IServiceOffer} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {loadServiceOffers, setValueServicePartial} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {Loading} from "../../../../../components/Loading/Loading";
import {OffersContainer} from "../../../../../components/styled/OffersContainer";
import {OfferCardWrapper} from "../../../../../components/styled/OfferCardWrapper";
import {ServiceTitle} from "../../../../../components/styled/ServiceTitle";

export const PageWrapper = styled('div')(({theme}) => ({
    // maxWidth: '80vw',
    minWidth: '50vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
    border: '1px solid #DADADA',
    [theme.breakpoints.down("md")]: {
        padding: 30,
    },
    [theme.breakpoints.down("sm")]: {
        padding: 20,
    }
}))

export const SubTitle = styled('span')(() => ({
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 600,
    color: '#202021',
    textTransform: 'uppercase',
}))

const Price = styled('span')(() => ({
    fontSize: 20,
    fontWeight: 600,
    color: "#202021"
}))

const SelectButton = styled(Button)(() => ({
    color: '#FFFFFF',
    backgroundColor: "#202021",
    padding: '9px 18px'
}))

export const CarName = styled('div')(() => ({
    color: "#202021",
    fontWeight: 600,
    fontSize: 24,
}))

export const ChangeButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    justifyContent: 'flex-start',
    padding: 8,
    marginBottom: 50,
    marginTop: 12,
    textTransform: 'unset',
    textDecoration: 'underline',
    fontWeight: 'normal',
    [theme.breakpoints.down("md")]: {
        marginBottom: 30,
    },
    [theme.breakpoints.down("sm")]: {
        marginBottom: 20,
    }
}))

type TServiceSelectionProps = {
    onNext: () => void;
    onBack: () => void;
}

const ServiceSelection: React.FC<TServiceSelectionProps> = ({onNext, onBack}) => {
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
        <PageWrapper>
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
        </PageWrapper>
    );
};

export default ServiceSelection;