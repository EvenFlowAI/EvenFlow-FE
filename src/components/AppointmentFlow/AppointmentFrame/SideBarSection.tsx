import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {SideBar} from "./SideBar";
import {TScreen} from "../types";
import AppointmentNotes from "./AppointmentNotes";
import VehicleRepairHistory from "../../Modals/common/VehicleRepairHistory/VehicleRepairHistory";
import {useTranslation} from "react-i18next";
import CustomerInfo from "./CustomerInfo";

const SectionWrapper = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: "stretch",
    justifyContent: "center",
}))

const RoHistoryLink = styled('div')(() => ({
    fontSize: 16,
    fontWeight: 600,
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