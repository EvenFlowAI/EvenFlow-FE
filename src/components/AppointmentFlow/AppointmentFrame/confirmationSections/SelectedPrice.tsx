import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const Price = styled('div')({
    marginTop: 8
})

export const SelectedPrice = () => {
    const appointment = useSelector((state: RootState) => state.appointment.appointment);
    return (
        <div>
            <ConfirmationTitle>Selected Price</ConfirmationTitle>
            <Price>${appointment?.price.value ?? 0}</Price>
        </div>
    );
};