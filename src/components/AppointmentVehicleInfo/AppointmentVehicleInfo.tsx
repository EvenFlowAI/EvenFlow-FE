import React, {useMemo} from 'react';
import {AppointmentConfirmationTitle} from "../AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {TitleWrapper} from "./styles";

const AppointmentVehicleInfo = () => {
    const {selectedVehicle, valueService} = useSelector((state: RootState) => state.appointmentFrame);
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {t} = useTranslation();
    const engine = useMemo(() => engineTypes.find(item => item.id === Number(selectedVehicle?.engineTypeId)), [engineTypes, selectedVehicle])

    return (
        <div>
            <TitleWrapper>
                <AppointmentConfirmationTitle>{t("Vehicle")}</AppointmentConfirmationTitle>
            </TitleWrapper>
            {valueService?.selectedService ? <>
                {valueService?.year?.year} <span style={{textTransform: 'uppercase'}}>{valueService?.series?.name}</span> {valueService?.model?.name}
            </> : <>
                {selectedVehicle?.year} <span style={{textTransform: 'uppercase'}}>{selectedVehicle?.make}</span> {selectedVehicle?.model} {engine?.name ?? ""}
            </>}
        </div>
    );
};

export default AppointmentVehicleInfo;