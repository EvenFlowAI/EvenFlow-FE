import React, {useCallback, useMemo} from 'react';
import {TArgCallback, TScreen} from "../../../../../types/types";
import {AppointmentSlots} from "../../Screens/AppointmentSlots/AppointmentSlots";
import {searchForCustomerConsents} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";

type TAppointmentSelectionProps = {
    handleSetScreen: TArgCallback<TScreen>;
}

const AppointmentSlotsCreate: React.FC<TAppointmentSelectionProps> = ({handleSetScreen}) => {
    const {isTransportationAvailable, isAdvisorAvailable, currentConfig} = useSelector((state: RootState) => state.bookingFlowConfig)
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame)
    const dispatch = useDispatch();

    const previousLogicalScreen: TScreen = useMemo(() => currentConfig?.appointmentSelection
        ? 'appointmentTiming'
        : isAdvisorAvailable
            ? 'consultantSelection'
            : "serviceNeeds",
        [currentConfig, isAdvisorAvailable])

    const onEmptyConsents = () => handleSetScreen("appointmentConfirmation")

    const handleNext = useCallback((): void => {
        if (isTransportationAvailable && !serviceTypeOption?.transportationOption) {
            handleSetScreen("transportationNeeds")
        } else {
            dispatch(searchForCustomerConsents(onEmptyConsents))
        }
    }, [isTransportationAvailable, serviceTypeOption])

    return (
        <AppointmentSlots
            handleSetScreen={handleSetScreen}
            onNext={handleNext}
            prevLogicalScreen={previousLogicalScreen}/>
    );
};

export default AppointmentSlotsCreate;