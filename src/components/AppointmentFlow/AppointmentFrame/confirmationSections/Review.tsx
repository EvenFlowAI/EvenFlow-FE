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
    listStyle: "none"
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
    const [vehicle, sc, ssc, consultant, transportation, sP] = useSelector((state: RootState) => [
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
                <li>{sP?.name ?? ssc?.name ?? sc?.name}</li>
                <li>Transportation needs: {transportation?.description ?? "Yes, I will be waiting"}</li>
                {/* TODO: Advisor | consultant*/}
                <li>Advisor: {consultant?.name ?? "Any Available"}</li>
            </Wrapper>
            <ButtonLink>View Details</ButtonLink>
        </div>
    );
};