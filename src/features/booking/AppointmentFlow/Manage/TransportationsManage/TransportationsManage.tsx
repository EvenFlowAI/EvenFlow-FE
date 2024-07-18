import React from 'react';
import {TActionProps, TCallback} from "../../../../../types/types";
import {TransportationNeeds} from "../../Screens/TransportationNeeds/TransportationNeeds";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {setCurrentFrameScreen, setTransportation} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {checkPodChanged} from "../../../../../store/reducers/appointments/actions";
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../../../utils/utils";
import {useException} from "../../../../../hooks/useException/useException";
import {setSlotsWarningOpen} from "../../../../../store/reducers/modals/actions";

const TransportationsManage: React.FC<TActionProps> = ({onBack, onNext}) => {
    const {isUsualFlowNeeded, appointmentByKey, editingPosition} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const showError = useException();

    const handleBack = () => {
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