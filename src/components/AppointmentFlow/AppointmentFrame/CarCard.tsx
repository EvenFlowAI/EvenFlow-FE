import React from 'react';
import {Button, styled} from "@material-ui/core";
import carImage from '../../../assets/img/carPlaceholder.png'
import {ILoadedVehicle} from "../../../api/types";

type TProps = {
    car: ILoadedVehicle;
}
const Wrapper = styled('div')({
    display: "flex",
    padding: 22,
    alignItems: "center",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    border: "1px solid #DADADA",
    'img': {
        maxWidth: '90%'
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
const Action: React.FC<{car: ILoadedVehicle}> = ({car}) => {
    return <ActionButton fullWidth variant="contained" color="primary">Schedule Appointment</ActionButton>
};

export const CarCard: React.FC<TProps> = ({car}) => {
    return (
        <Wrapper>
            <img src={carImage} alt="Car"/>
            <CarInfo>
                <li>{car.year} {car.make} {car.model}</li>
                <li>VIN: <span>{car.vin}</span></li>
            </CarInfo>
            <Action car={car} />
        </Wrapper>
    );
};