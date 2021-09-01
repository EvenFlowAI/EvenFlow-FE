import React, {useEffect} from 'react';
import {Title} from "./Title";
import {CarCard} from "./CarCard";
import {styled} from "@material-ui/core";
import {Actions} from "./Actions";
import {TCallback} from "../../../types/types";
import { StepWrapper } from './StepWrapper';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {getBlankVehicle} from "../../../store/reducers/appointment/actions";


const CarsWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "20px",
    justifyContent: "stretch"
});

const Info = styled('div')({
    fontSize: 14,
    "& span": {
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none"
        }
    }
})

type TProps = {
    onNext: TCallback;
    onBack: TCallback;
    loading: boolean;
}
export const AppointmentCarSelection: React.FC<TProps> = ({onNext, onBack, loading}) => {
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);
    const dispatch = useDispatch();

    useEffect(() => {
        if (customerLoadedData && !customerLoadedData?.id) {
            onNext();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerLoadedData]);

    const handleSkip = () => {
        dispatch(setVehicle(getBlankVehicle()));
        onNext();
    }

    return (
        <StepWrapper>
            <Title>Which vehicle are you coming in for?</Title>
            <CarsWrapper>
                {customerLoadedData?.vehicles.length ?
                    customerLoadedData.vehicles.map(vehicle =>
                        <CarCard
                            selected={selectedVehicle?.vin === vehicle.vin}
                            car={vehicle}
                            key={vehicle.vin} />
                    ) : <p>No vehicles present</p>
                }
            </CarsWrapper>
            <Info>
                Click here to <span onClick={handleSkip}>add new vehicle</span>
            </Info>
            <Actions onBack={onBack} onNext={onNext} nextDisabled={!selectedVehicle} loading={loading} />
        </StepWrapper>
    );
};