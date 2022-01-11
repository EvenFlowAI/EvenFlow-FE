import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const Wrapper = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "12px",
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    "& .service-item": {
        textTransform: "capitalize"
    }
});

const TRANSPORTATION_SHORT_DESCRIPTION = ["I will take the shuttle", "I would like a loaner vehicle", "I would like a rental car", "I would like to book me a ride", "I would like vehicle pick up / drop off services"]

export const Review = () => {
    const [
        consultant,
        transportation,
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.advisor,
        state.appointmentFrame.transportation,
    ]);
    return (
        <div>
            <ConfirmationTitle>Appointment Details</ConfirmationTitle>
            <Wrapper>
                <li>Transportation needs: {
                    typeof transportation?.type === 'number'
                    ? TRANSPORTATION_SHORT_DESCRIPTION[transportation.type]
                    : "I will wait at the dealership"}
                </li>
                {/* TODO: Advisor | consultant*/}
                <li>Advisor: {consultant?.name ?? "Any Available"}</li>
            </Wrapper>
        </div>
    );
};