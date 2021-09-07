import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {getMaintenanceDescription} from "../uiUtils";

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
const ButtonLink = styled('div')({
    textDecoration: "underline",
    marginTop: 10,
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
        textDecoration: "none"
    }
})

export const Review = () => {
    const [
        selectedSr,
        srList,
        vehicle,
        sc, ssc,
        consultant,
        transportation,
        sP
    ] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests,
        state.appointmentFrame.selectedVehicle,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.advisor,
        state.appointmentFrame.transportation,
        state.appointmentFrame.selectedPackage
    ]);
    return (
        <div>
            <ConfirmationTitle>Review</ConfirmationTitle>
            <Wrapper>
                <li>{vehicle?.year} {vehicle?.make} {vehicle?.model}</li>
                <li className="service-item">{getMaintenanceDescription(
                    srList, selectedSr, sP, sc, ssc
                )}</li>
                <li>Transportation needs: {transportation?.description ?? "Yes, I will be waiting"}</li>
                {/* TODO: Advisor | consultant*/}
                <li>Advisor: {consultant?.name ?? "Any Available"}</li>
            </Wrapper>
            <ButtonLink>View Details</ButtonLink>
        </div>
    );
};