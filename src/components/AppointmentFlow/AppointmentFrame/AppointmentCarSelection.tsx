import React, {useEffect, useMemo, useState} from 'react';
import {Title} from "./Title";
import {CarCard} from "./CarCard";
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import { StepWrapper } from './StepWrapper';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {ILoadedVehicle} from "../../../api/types";
import {checkSelectedCar} from "./utils";
import {setMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/actions";


const CarsWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "20px",
    width: "100%",
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
});

const Arrow = styled("span")<Theme, {disabled?: boolean}>(({theme, disabled}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    cursor: "pointer",
    border: "1px solid #DADADA",
    opacity: disabled ? .4 : 1
}));

type TProps = {
    onNext: TCallback;
    onBack: TCallback;
    onAddNew: TCallback;
    onAddNewCarAppointment: TArgCallback<ILoadedVehicle>;
    loading: boolean;
}
export const AppointmentCarSelection: React.FC<TProps> = ({
    onNext, onBack, loading, onAddNew, onAddNewCarAppointment}) => {

    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);
    const [idx, setIdx] = useState<number>(0);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const dispatch = useDispatch();

    const vehiclesPerScreen = useMemo(() => {
        return isXs ? 1 : 2;
    }, [isXs]);

    const next = () => {
        if (!nextDisabled()) {
            setIdx(p => p + 1);
        }
    }
    const prev = () => {
        if (!prevDisabled()) {
            setIdx(p => p - 1);
        }
    }

    useEffect(() => {
        if (customerLoadedData && !customerLoadedData.vehicles?.length) {
            onNext();
        }
        dispatch(setMaintenanceDetails({ mileage: ''}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerLoadedData, selectedVehicle]);

    const nextDisabled = () => idx >= (customerLoadedData?.vehicles.length ?? 0) - vehiclesPerScreen;
    const prevDisabled = () => idx <= 0;

    const isSelected = (vehicle: ILoadedVehicle) => {
        if (!selectedVehicle) {
            return false;
        }
        if (!selectedVehicle.vin) {
            return selectedVehicle.make === vehicle.make
                && selectedVehicle.model === vehicle.model
                && selectedVehicle.year === vehicle.year;
        }
        return selectedVehicle.vin === vehicle.vin;
    }

    return (
        <StepWrapper>
            <Title>Which vehicle are you coming in for?</Title>
            <CarsWrapper>
                {customerLoadedData?.vehicles.length ?
                    <>
                        <Arrow onClick={prev} disabled={prevDisabled()}>
                            <ChevronLeft />
                        </Arrow>
                        {customerLoadedData.vehicles
                            .slice(idx, idx + vehiclesPerScreen)
                            .map(vehicle =>
                                <CarCard
                                    onAddNewAppointment={onAddNewCarAppointment}
                                    selected={isSelected(vehicle)}
                                    car={vehicle}
                                    key={vehicle.vin}/>
                            )}
                        <Arrow onClick={next} disabled={nextDisabled()}>
                            <ChevronRight />
                        </Arrow>
                    </> : <p>No vehicles present</p>
                }
            </CarsWrapper>
            <Info>
                Click here to <span onClick={onAddNew}>add new vehicle</span>
            </Info>
            <Actions
                onBack={onBack}
                onNext={onNext}
                nextDisabled={!selectedVehicle
                    || !checkSelectedCar(selectedVehicle, customerLoadedData?.vehicles)}
                loading={loading} />
        </StepWrapper>
    );
};