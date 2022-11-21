import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {CarName, ChangeButton, PageWrapper, SubTitle} from "./ServiceSelection";
import {styled} from "@material-ui/core";
import {Actions} from "../Actions";
import {IServiceCategory} from "../../../../api/types";
import Price from "./Price";

type TServiceDetails = {
    onChangeVehicle: () => void;
    onBack: () => void;
    onNext: () => void;
    selectedService: IServiceCategory;
}

const Description = styled('div')(() => ({
    padding: 10,
    marginBottom: 20,
    "& > p:not(:last-child)": {
        fontWeight: 600,
        color: "#828282",
    }
}))

const ServiceDetails: React.FC<TServiceDetails> = ({onChangeVehicle, onBack, onNext, selectedService}) => {
    const {selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);

    return <PageWrapper>
            {selectedVehicle ? <CarName>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</CarName> : null}
            {selectedVehicle ? <ChangeButton onClick={onChangeVehicle} variant="text">Change Vehicle</ChangeButton> : null}
            <SubTitle>{selectedService.name}</SubTitle>
            <Price selectedService={selectedService}/>
            <Actions
                onBack={onBack}
                onNext={onNext}
            />
        </PageWrapper>;
};

export default ServiceDetails;