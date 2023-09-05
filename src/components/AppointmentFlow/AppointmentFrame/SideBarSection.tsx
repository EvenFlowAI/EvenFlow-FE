import React from 'react';
import {Button, styled} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {SideBar} from "./SideBar";
import {TScreen} from "../../Layout/types";
import AppointmentNotes from "./AppointmentNotes";
import VehicleRepairHistory from "../../Modals/VehicleRepairHistory/VehicleRepairHistory";
import {useTranslation} from "react-i18next";

const SectionWrapper = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: "stretch",
    justifyContent: "center",
}))

type TProps = {
    screen: TScreen;
    handleSetScreen: (screen: TScreen) => void;
}

const SideBarSection: React.FC<TProps> = ({screen, handleSetScreen}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment)
    const {selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame)
    const {onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory} = useModal();
    const currentUser = useCurrentUser()
    const {t} = useTranslation();

    return currentUser && currentUser.dealershipId === scProfile?.dealershipId
        ? <SectionWrapper>
            <SideBar screen={screen} handleSetScreen={handleSetScreen}/>
            {selectedVehicle?.hasRepairOrders && selectedVehicle?.dmsId
                ? <Button variant="text" onClick={onOpenHistory}>{t("See RO History")}</Button>
                : null}
            <AppointmentNotes/>
            {selectedVehicle?.hasRepairOrders && selectedVehicle?.dmsId
                ? <VehicleRepairHistory open={isOpenHistory} onClose={onCloseHistory} vehicleDmsId={selectedVehicle.dmsId}/>
                : null}
        </SectionWrapper>
        : <SideBar screen={screen} handleSetScreen={handleSetScreen}/>
};

export default SideBarSection;