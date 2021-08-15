import React from 'react';
import {Title} from "./Title";
import {CarCard} from "./CarCard";
import {styled} from "@material-ui/core";
import {ILoadedVehicle} from "../../../api/types";
import {Actions} from "./Actions";

const Wrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    flexDirection: "column"
})
const CarsWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "20px",
    justifyContent: "stretch"
});
const car: ILoadedVehicle = {
    model: "F-150",
    make: "Ford",
    year: 2020,
    mileage: 0,
    dmsId: 'asd',
    vin: '1FTMF1EP1MKD85171'
}

export const AppointmentCarSelection = () => {
    return (
        <Wrapper>
            <Title>Which vehicle are you coming in for?</Title>
            <CarsWrapper>
                <CarCard car={car} />
                <CarCard car={car} />
            </CarsWrapper>
            <Actions onBack={() => {}} onNext={() => {}} />
        </Wrapper>
    );
};