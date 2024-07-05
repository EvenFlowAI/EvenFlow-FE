import React from 'react';
import {TArgCallback, TScreen} from "../../../../types/types";
import {AppointmentTiming} from "../../AppointmentTiming/AppointmentTiming";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const AppointmentTimingCreate: React.FC<{handleSetScreen: TArgCallback<TScreen>}> = ({handleSetScreen}) => {
    const {consultants} = useSelector((state: RootState) => state.appointmentFrame)
    const {isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig)

    const onBack = () => handleSetScreen(isAdvisorAvailable && consultants.length ? 'consultantSelection' : 'serviceNeeds')
    return <AppointmentTiming handleSetScreen={handleSetScreen} onBack={onBack}/>
};

export default AppointmentTimingCreate;