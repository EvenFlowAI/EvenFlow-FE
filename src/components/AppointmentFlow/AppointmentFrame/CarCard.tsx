import React, {useCallback} from 'react';
import {
    Button,
    styled,
    Theme, withStyles
} from "@material-ui/core";
import carImage from '../../../assets/img/car_icon.svg';
import {ILoadedVehicle} from "../../../api/types";
import {useDispatch} from "react-redux";
import {setVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {useTranslation} from "react-i18next";
import CarCardAction from "./CarCardAction";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import VehicleRepairHistory from "../../Modals/VehicleRepairHistory/VehicleRepairHistory";

type TProps = {
    car: ILoadedVehicle;
    selected?: boolean;
    onAddNewAppointment: TArgCallback<ILoadedVehicle>;
    clearData: () => void;
    onNext: TCallback;
    onSelectCar: TArgCallback<ILoadedVehicle>;
    hasOrders?: boolean;
}
const Wrapper = styled((({active, ...props}) => (<div {...props}/>)))<Theme, {active?: boolean}>(({theme}) => ({
    display: "flex",
    flex: "1 1 0px",
    padding: 22,
    alignItems: "stretch",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    transition: 'all .2s',
    '& img': {
        maxWidth: '90%',
        maxHeight: "200px",
        margin: "auto"
    },
    "& button": {
        fontSize: 14
    },
    [theme.breakpoints.up("sm")]: {
        maxWidth: '50%',
    }
}));

const CarDataWithBtn = styled('div')({
    display: 'flex',
    justifyContent: "space-between",
    alignItems: 'flex-start'
})
const CarInfo = styled('ul')({
    fontSize: 20,
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    '&>li span': {
        color: "#BDBDBD",
        fontWeight: "normal"
    }
});

const RepairBtn = withStyles({
    root: {
        textTransform: "none",
        textDecoration: "underline",
        fontSize: 14,
        fontWeight: 600
    }
})(Button)

export const CarCard: React.FC<TProps> = ({
    onNext,
    car,
    selected,
    onAddNewAppointment,
    clearData,
                                              onSelectCar,
    hasOrders,
}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const currentUser = useCurrentUser();
    const {onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory} = useModal();

    const onClick = useCallback(() => {
        dispatch(setVehicle(car));
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