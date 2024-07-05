import React, {useCallback, useMemo} from 'react';
import {TArgCallback, TScreen} from "../../../../types/types";
import {AppointmentSlots} from "./AppointmentSlots";
import {setChangesCompletedOpen} from "../../../../store/reducers/modals/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

type TAppointmentSelectionProps = {
    handleSetScreen: TArgCallback<TScreen>;
}

const AppointmentSlotsManage: React.FC<TAppointmentSelectionProps> = ({handleSetScreen}) => {
    const {isTransportationAvailable, isAdvisorAvailable, currentConfig} = useSelector((state: RootState) => state.bookingFlowConfig)
    const {
        serviceTypeOption,
        prevScreen,
        isUsualFlowNeeded,
        appointmentByKey
    } = useSelector((state: RootState) => state.appointmentFrame)
    const dispatch = useDispatch();

    const fromServiceValetToVisitCenter = useMemo(() => {
        return serviceTypeOption?.type === EServiceType.VisitCenter
            && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff
    }, [serviceTypeOption, appointmentByKey])

    const previousLogicalScreen: TScreen = useMemo(() => !isUsualFlowNeeded && prevScreen
            ? prevScreen
            : currentConfig?.appointmentSelection
                ? 'appointmentTiming'
                : isAdvisorAvailable
                    ? 'consultantSelection'
                    : "serviceNeeds",
        [currentConfig, isAdvisorAvailable])

    const handleTransportation = useCallback(() => {
        if (serviceTypeOption?.transportationOption || !isTransportationAvailable) {
            dispatch(setChangesCompletedOpen(true))
        } else {
            handleSetScreen('transportationNeeds')
        }
    }, [serviceTypeOption, isTransportationAvailable])

    return (
        <AppointmentSlots
            handleSetScreen={handleSetScreen}
            onNext={handleTransportation}
            fromServiceValetToVisitCenter={fromServiceValetToVisitCenter}
            prevLogicalScreen={previousLogicalScreen}/>
    );
};

export default AppointmentSlotsManage;