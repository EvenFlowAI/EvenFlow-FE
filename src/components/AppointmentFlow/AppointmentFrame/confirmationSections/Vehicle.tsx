import React from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
})

const Vehicle = () => {
    const {selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);
    return (
        <div>
            <TitleWrapper>
                <ConfirmationTitle>Vehicle: </ConfirmationTitle>
            </TitleWrapper>
            <span style={{textTransform: 'uppercase'}}>{selectedVehicle?.make}</span> {selectedVehicle?.model} {selectedVehicle?.year}
        </div>
    );
};

export default Vehicle;