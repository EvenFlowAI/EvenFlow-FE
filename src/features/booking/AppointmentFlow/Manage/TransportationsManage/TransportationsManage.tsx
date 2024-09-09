import React, {useCallback} from 'react';
import {TActionProps} from "../../../../../types/types";
import {TransportationNeeds} from "../../Screens/TransportationNeeds/TransportationNeeds";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {
    setCurrentFrameScreen,
    setServiceTypeOption,
    setTransportation, setWelcomeScreenView
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {checkPodChanged} from "../../../../../store/reducers/appointments/actions";
import {useHistory, useParams} from "react-router-dom";
import {decodeSCID} from "../../../../../utils/utils";
import {useException} from "../../../../../hooks/useException/useException";
import {setSlotsWarningOpen} from "../../../../../store/reducers/modals/actions";
import {Routes} from "../../../../../routes/constants";

const TransportationsManage: React.FC<TActionProps> = ({onBack, onNext}) => {
    const {isUsualFlowNeeded, appointmentByKey, serviceOptionChangedFromSlotPage, editingPosition} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const {wasWarningShowed} = useSelector((state: RootState) => state.modals);
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const showError = useException();
    const history = useHistory();

    const redirect = useCallback(() => {
        if (editingPosition === 'serviceOption') {
            dispatch(setWelcomeScreenView('serviceSelect'));
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        } else {
            dispatch(setCurrentFrameScreen("manageAppointment"))
        }
    }, [editingPosition, id, history])

    const handleBack = useCallback(() => {
        if ((serviceOptionChangedFromSlotPage && editingPosition === 'slot') || editingPosition === 'serviceOption') {
            dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        }
        if (!isUsualFlowNeeded) {
            dispatch(setTransportation(appointmentByKey?.transportationOption ?? null))
            redirect()
        } else {
            dispatch(setTransportation(null));
            onBack();
        }
    }, [serviceOptionChangedFromSlotPage, editingPosition, appointmentByKey, isUsualFlowNeeded, redirect, onBack])

    const checkPod = () => {
        dispatch(checkPodChanged(decodeSCID(id), showError))
    }

    const handleNext = useCallback(() => {
        editingPosition === 'transportation' && !wasWarningShowed
            ? dispatch(setSlotsWarningOpen(true))
            : onNext()
    }, [editingPosition, wasWarningShowed, onNext])

    return <TransportationNeeds onBack={handleBack} onNext={handleNext} handleConsentsAccepted={checkPod}/>
};

export default TransportationsManage;