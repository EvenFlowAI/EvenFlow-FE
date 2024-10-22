import React from 'react';
import {ILoadedVehicle} from "../../../../../../api/types";
import {useDispatch, useSelector} from "react-redux";
import {setVehicle} from "../../../../../../store/reducers/appointmentFrameReducer/actions";
import {TArgCallback} from "../../../../../../types/types";
import VehicleRepairHistory from "../../../../../../components/modals/common/VehicleRepairHistory/VehicleRepairHistory";
import {RootState} from "../../../../../../store/rootReducer";
import {CarDataWithBtn, CardBtnWrapper, CarInfo, RepairBtn, StyledButton, Wrapper} from "./styles";
import {useModal} from "../../../../../../hooks/useModal/useModal";
import {useCurrentUser} from "../../../../../../hooks/useCurrentUser/useCurrentUser";
import {Button} from "@mui/material";

type TProps = {
    car: ILoadedVehicle;
    clearData: () => void;
    onSelectCar: TArgCallback<ILoadedVehicle>;
    hasOrders?: boolean;
}

export const CarCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
    car,
    clearData,
                                              onSelectCar,
    hasOrders,
}) => {
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const currentUser = useCurrentUser();
    const {onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory} = useModal();

    const onOpen = (e: React.MouseEvent) => {
        e.stopPropagation()
        onOpenHistory();
    }

    const onButtonClick = () => {
        clearData()
        const selectedMileage = mileage.find(el => el.value.toString() === car?.mileage?.toString());
        dispatch(setVehicle({...car, mileage: selectedMileage?.value ?? null}));
        onSelectCar(car)
    }

    return (
        <>
        <Wrapper>
            <CarDataWithBtn>
                <CarInfo>
                    {car.year} {car.make} {car.model} {car?.modelDetails ?? ''}
                </CarInfo>
                {currentUser && hasOrders ? <RepairBtn variant="text" onClick={onOpen}>Repair Order History</RepairBtn> : null}
            </CarDataWithBtn>
            <CardBtnWrapper>
                <Button color="info" variant="contained" onClick={onButtonClick}>Schedule</Button>
                <StyledButton onClick={onButtonClick} disabled={!car.appointmentHashKeys.length}>Manage</StyledButton>
            </CardBtnWrapper>
        </Wrapper>
            {car.id && customerLoadedData?.id
                ? <VehicleRepairHistory
                    customerId={customerLoadedData.id}
                    open={isOpenHistory}
                    onClose={onCloseHistory}
                    vehicleId={car.id}/>
                : null}
        </>
    );
};