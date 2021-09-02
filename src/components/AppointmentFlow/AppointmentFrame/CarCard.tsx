import React from 'react';
import {Button, styled, Theme} from "@material-ui/core";
import carImage from '../../../assets/img/blank-car.svg';
import {ILoadedVehicle} from "../../../api/types";
import {useDispatch} from "react-redux";
import {setVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";

type TProps = {
    car: ILoadedVehicle;
    selected?: boolean;
}
const Wrapper = styled('div')<Theme, {active?: boolean}>({
    display: "flex",
    padding: 22,
    flex: "1 1 0px",
    alignItems: "stretch",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    transition: 'all .2s',
    border: ({active}) => `1px solid ${active ? '#000000' : '#DADADA'}`,
    '& img': {
        maxWidth: '90%',
        maxHeight: "200px",
        margin: "auto"
    },
    "& button": {
        fontSize: 14
    }
});
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
const ActionButton = styled(Button)({
    fontSize: 20
});
const Action: React.FC<{car: ILoadedVehicle, selected?: boolean}> = ({car}) => {
    const dispatch = useDispatch();
    const getLabel = (): string => {
        return car.appointmentHashKeys.length ? "Manage Appointment" : "Schedule Appointment";
    }
    const handleClick = () => {
        dispatch(setVehicle(car));
    }
    return <ActionButton
        onClick={handleClick}
        fullWidth
        variant="contained"
        color="primary">
        {getLabel()}
    </ActionButton>
};

export const CarCard: React.FC<TProps> = ({car, selected}) => {
    return (
        <Wrapper active={selected}>
            <img src={carImage} alt="Car"/>
            <CarInfo>
                <li>{car.year} {car.make} {car.model}</li>
                <li>VIN: <span>{car.vin}</span></li>
            </CarInfo>
            <Action selected={selected} car={car} />
        </Wrapper>
    );
};