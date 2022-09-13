import React from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
})

const Vehicle = () => {
    const {selectedVehicle, valueService} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    return (
        <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Vehicle")}</ConfirmationTitle>
            </TitleWrapper>
            {valueService?.selectedService ? <>
                {valueService?.year?.year} <span style={{textTransform: 'uppercase'}}>{valueService?.series?.name}</span> {valueService?.model?.name}
            </> : <>
                {selectedVehicle?.year} <span style={{textTransform: 'uppercase'}}>{selectedVehicle?.make}</span> {selectedVehicle?.model}
            </>}
        </div>
    );
};

export default Vehicle;