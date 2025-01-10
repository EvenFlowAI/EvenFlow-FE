import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { ActionButtons } from "../../ActionButtons/ActionButtons";
import { IServiceCategory } from "../../../../api/types";
import Price from "../Price/Price";
import { OfferPageWrapper } from "../../../../components/styled/OfferPageWrapper";
import { CarName } from "../../../../components/styled/CarName";
import { ChangeButton } from "../../../../components/styled/ChangeButton";
import { SubTitle } from "../../../../components/styled/SubTitle";

type TServiceDetails = {
  onChangeVehicle: () => void;
  onBack: () => void;
  onNext: () => void;
  selectedService: IServiceCategory;
};

const ServiceDetails: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TServiceDetails>>
> = ({ onChangeVehicle, onBack, onNext, selectedService }) => {
  const { selectedVehicle } = useSelector(
    (state: RootState) => state.appointmentFrame,
  );

  return (
    <OfferPageWrapper>
      {selectedVehicle ? (
        <CarName>
          {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
        </CarName>
      ) : null}
      {selectedVehicle ? (
        <ChangeButton onClick={onChangeVehicle} variant="text">
          Change Vehicle
        </ChangeButton>
      ) : null}
      <SubTitle>{selectedService.name}</SubTitle>
      <Price selectedService={selectedService} />
      <ActionButtons onBack={onBack} onNext={onNext} />
    </OfferPageWrapper>
  );
};

export default ServiceDetails;
