import React, {useMemo} from 'react';
import {
    EServiceType,
} from "../../../../../../store/reducers/appointmentFrameReducer/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";

const ServiceOption = () => {
    const {currentAppointment} = useSelector((state: RootState) => state.appointments);
    const serviceType = useMemo(() => currentAppointment?.serviceTypeOption
        ? currentAppointment.serviceTypeOption.type
        : EServiceType.VisitCenter,
        [currentAppointment]);

    const getServiceName = () => {
        if (currentAppointment?.serviceTypeOption) return currentAppointment.serviceTypeOption.name
        switch (serviceType) {
            case EServiceType.MobileService:
                return "Mobile Service";
            case EServiceType.PickUpDropOff:
                return "Pick Up / Drop Off Service";
            default:
                return "Visit Center";
        }
    }

    return <div className="service-list" style={{marginBottom: 10, marginTop: 20}}>
        <div>SERVICE OPTION: {getServiceName()}</div>
    </div>
};

export default ServiceOption;