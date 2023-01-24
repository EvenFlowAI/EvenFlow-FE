import React, {useCallback} from 'react';
import {
    styled,
    Theme
} from "@material-ui/core";
import carImage from '../../../assets/img/car_icon.svg';
import {ILoadedVehicle} from "../../../api/types";
import {useDispatch} from "react-redux";
import {setVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {useTranslation} from "react-i18next";
import CarCardAction from "./CarCardAction";

type TProps = {
    car: ILoadedVehicle;
    selected?: boolean;
    onAddNewAppointment: TArgCallback<ILoadedVehicle>;
    clearData: () => void;
    onNext: TCallback;
}
const Wrapper = styled('div')<Theme, {active?: boolean}>(({theme}) => ({
    display: "flex",
    flex: "1 1 0px",
    padding: 22,
    alignItems: "stretch",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    transition: 'all .2s',
    border: ({active}) => `1px solid ${active ? '#DADADA' : '#000000'}`,
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

export const CarCard: React.FC<TProps> = ({
    onNext,
    car,
    selected,
    onAddNewAppointment,
    clearData,
}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

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
            <CarInfo>
                <li>{car.year} {car.make} {car.model} {car?.modelDetails ?? ''}</li>
                <li>{t("VIN")}: <span>{car.vin}</span></li>
            </CarInfo>
            <CarCardAction
                onAddNewAppointment={onAddNewAppointment}
                selected={selected}
                car={car}
                clearData={clearData}
                onNext={onNext}
            />
        </Wrapper>
    );
};