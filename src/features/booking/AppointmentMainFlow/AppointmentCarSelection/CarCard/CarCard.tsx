import React, {useCallback} from 'react';
import carImage from '../../../../../assets/img/car_icon.svg';
import {ILoadedVehicle} from "../../../../../api/types";
import {useDispatch, useSelector} from "react-redux";
import {setVehicle} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {TArgCallback, TCallback} from "../../../../../types/types";
import {useTranslation} from "react-i18next";
import CarCardAction from "../CarCardAction/CarCardAction";
import {useCurrentUser, useModal} from "../../../../../utils/hooks";
import VehicleRepairHistory from "../../../../../components/modals/common/VehicleRepairHistory/VehicleRepairHistory";
import {RootState} from "../../../../../store/rootReducer";
import {CarDataWithBtn, CarInfo, RepairBtn, Wrapper} from "./styles";

type TProps = {
    car: ILoadedVehicle;
    selected?: boolean;
    onAddNewAppointment: TArgCallback<ILoadedVehicle>;
    clearData: () => void;
    onNext: TCallback;
    onSelectCar: TArgCallback<ILoadedVehicle>;
    hasOrders?: boolean;
}

export const CarCard: React.FC<TProps> = ({
    onNext,
    car,
    selected,
    onAddNewAppointment,
    clearData,
                                              onSelectCar,
    hasOrders,
}) => {
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const currentUser = useCurrentUser();
    const {onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory} = useModal();

    const onClick = useCallback(() => {
        const selectedMileage = mileage.find(el => el.value.toString() === car?.mileage?.toString());
        dispatch(setVehicle({...car, mileage: selectedMileage?.value ?? null}));
    }, [car])

    return (
        <Wrapper
            active={selected}
            role="presentation"
            onClick={onClick}
            style={{border: `2px solid ${selected ? '#DADADA' : 'transparent'}`}}>
            <img src={carImage} alt="Car"/>
            <CarDataWithBtn>
                <CarInfo>
                    <li>{car.year} {car.make} {car.model} {car?.modelDetails ?? ''}</li>
                    <li>{t("VIN")}: <span>{car.vin}</span></li>
                </CarInfo>
                {currentUser && hasOrders ? <RepairBtn variant="text" onClick={onOpenHistory}>Repair Order History</RepairBtn> : null}
            </CarDataWithBtn>
            <CarCardAction
                onSelectCar={onSelectCar}
                onAddNewAppointment={onAddNewAppointment}
                selected={selected}
                car={car}
                clearData={clearData}
                onNext={onNext}
            />
            {car.dmsId ? <VehicleRepairHistory open={isOpenHistory} onClose={onCloseHistory} vehicleDmsId={car.dmsId}/> : null}
        </Wrapper>
    );
};