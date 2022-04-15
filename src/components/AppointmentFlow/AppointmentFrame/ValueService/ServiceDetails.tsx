import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {CarName, ChangeButton, PageWrapper, SubTitle} from "./ServiceSelection";
import {styled} from "@material-ui/core";
import {Loading} from "../../../UI/Loading";
import {Actions} from "../Actions";

type TServiceDetails = {
    onChangeVehicle: () => void;
    onBack: () => void;
    onNext: () => void;
}

const Description = styled('div')(() => ({
    padding: 10,
    marginBottom: 20,
}))

const Price = styled('div')(() => ({
    fontSize: 20,
}))

const ServiceDetails: React.FC<TServiceDetails> = ({onChangeVehicle, onBack, onNext}) => {
    const {valueService} = useSelector((state: RootState) => state.appointmentFrame);

    return valueService.selectedService ? (
        <PageWrapper>
            <CarName>{valueService.year} {valueService.series} {valueService.model}</CarName>
            <ChangeButton onClick={onChangeVehicle} variant="text">Change Vehicle</ChangeButton>
            <SubTitle>{valueService.selectedService?.name}</SubTitle>
            <Price>${valueService.selectedService?.price}</Price>
            <Description dangerouslySetInnerHTML={{ __html: valueService.selectedService?.description}}/>
            <Actions
                onBack={onBack}
                onNext={onNext}
                nextLabel="Schedule Service"
            />
        </PageWrapper>
    )
        : <Loading/>;
};

export default ServiceDetails;