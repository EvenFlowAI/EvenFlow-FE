import React from 'react';
import {TActionProps} from "../../../../../types/types";
import {TransportationNeeds} from "../../Screens/TransportationNeeds/TransportationNeeds";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {
    setCurrentFrameScreen,
    setServiceTypeOption,
    setTransportation
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {checkPodChanged} from "../../../../../store/reducers/appointments/actions";
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../../../utils/utils";
import {useException} from "../../../../../hooks/useException/useException";
import {setSlotsWarningOpen} from "../../../../../store/reducers/modals/actions";

const TransportationsManage: React.FC<TActionProps> = ({onBack, onNext}) => {
    const {isUsualFlowNeeded, appointmentByKey, serviceOptionChangedFromSlotPage, editingPosition} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const {appointment} = useSelector(({appointment}: RootState) => appointment)
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const showError = useException();

    const handleBack = () => {
        if (serviceOptionChangedFromSlotPage && editingPosition === 'slot') {
            dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        }
        if (!isUsualFlowNeeded) {
            dispatch(setTransportation(appointmentByKey?.transportationOption ?? null))
            dispatch(setCurrentFrameScreen("manageAppointment"))
        } else {
            dispatch(setTransportation(null));
            onBack();
        }
    }

    const checkPod = () => {
        dispatch(checkPodChanged(decodeSCID(id), showError))
    }

    const handleNext = () => {
        editingPosition === 'slot'
            ? onNext()
            : dispatch(setSlotsWarningOpen(true))
    }

    return <TransportationNeeds onBack={handleBack} onNext={handleNext} handleConsentsAccepted={checkPod}/>
};

export default TransportationsManage;