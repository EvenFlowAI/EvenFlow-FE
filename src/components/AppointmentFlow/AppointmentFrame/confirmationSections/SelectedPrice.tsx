import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const Price = styled('div')({
    marginTop: 8,
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
})

export const SelectedPrice = () => {
    const {appointment, scProfile} = useSelector((state: RootState) => state.appointment);
    return (
        <div>
            <ConfirmationTitle>Selected Price</ConfirmationTitle>
            <Price>
                {appointment?.price.value ?
                    <span>${scProfile?.isRoundPrice
                        ? appointment.price.value
                        : appointment.price.value.toFixed(2)}
                    </span>
                    : 'Service items will be quoted at dealership'
                }
            </Price>
        </div>
    );
};