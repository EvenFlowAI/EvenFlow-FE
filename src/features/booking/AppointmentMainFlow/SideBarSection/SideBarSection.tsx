import React, {useMemo} from 'react';
import {useCurrentUser, useModal} from "../../../../utils/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {SideBar} from "../SideBar/SideBar";
import AppointmentNotes from "../AppointmentNotes/AppointmentNotes";
import VehicleRepairHistory from "../../../../components/modals/common/VehicleRepairHistory/VehicleRepairHistory";
import {useTranslation} from "react-i18next";
import CustomerInfo from "../CustomerInfo/CustomerInfo";
import {TScreen} from "../../../../types/types";
import {RoHistoryLink, SectionWrapper} from "./styles";

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
    const hasHistory = useMemo(() => {
       return selectedVehicle?.hasRepairOrders && selectedVehicle?.dmsId
    }, [selectedVehicle])

    return currentUser && currentUser.dealershipId === scProfile?.dealershipId
        ? <SectionWrapper>
            <SideBar screen={screen} handleSetScreen={handleSetScreen}/>
            <CustomerInfo/>
            <RoHistoryLink
                onClick={onOpenHistory}
                style={{color: hasHistory ? "#142EA1" : "grey", cursor: hasHistory ? "pointer" : "unset"}}>
                {t("See RO History")}
            </RoHistoryLink>
            <AppointmentNotes/>
            {hasHistory && selectedVehicle?.dmsId
                ? <VehicleRepairHistory open={isOpenHistory} onClose={onCloseHistory} vehicleDmsId={selectedVehicle.dmsId}/>
                : null}
        </SectionWrapper>
        : <SideBar screen={screen} handleSetScreen={handleSetScreen}/>
};

export default SideBarSection;