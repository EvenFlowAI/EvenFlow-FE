import React, {useMemo} from 'react';
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
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {t} = useTranslation();
    const engine = useMemo(() => engineTypes.find(item => item.id === Number(selectedVehicle?.engineType)), [engineTypes, selectedVehicle])
    return (
        <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Vehicle")}</ConfirmationTitle>
            </TitleWrapper>
            {valueService?.selectedService ? <>
                {valueService?.year?.year} <span style={{textTransform: 'uppercase'}}>{valueService?.series?.name}</span> {valueService?.model?.name}
            </> : <>
                {selectedVehicle?.year} <span style={{textTransform: 'uppercase'}}>{selectedVehicle?.make}</span> {selectedVehicle?.model} {engine?.name ?? ""}
            </>}
        </div>
    );
};

export default Vehicle;