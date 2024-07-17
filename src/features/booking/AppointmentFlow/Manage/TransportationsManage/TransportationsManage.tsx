import React, {useMemo} from 'react';
import {TActionProps} from "../../../../../types/types";
import {TransportationNeeds} from "../../Screens/TransportationNeeds/TransportationNeeds";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {
    setCurrentFrameScreen,
    setServiceTypeOption,
    setTransportation
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import dayjs from "dayjs";
import {checkPodChanged} from "../../../../../store/reducers/appointments/actions";
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../../../utils/utils";
import {useException} from "../../../../../hooks/useException/useException";

const TransportationsManage: React.FC<TActionProps> = ({onBack, onNext}) => {
    const {isUsualFlowNeeded, appointmentByKey, serviceOptionChangedFromSlotPage, editingPosition} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const {appointment} = useSelector(({appointment}: RootState) => appointment)
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const showError = useException();

    const date = useMemo(() => {
        let fullDateString = ''
        if (appointmentByKey) {
            const [hh, mm] = appointmentByKey?.timeSlot.split(":");
            fullDateString = dayjs.utc(appointmentByKey?.dateInUtc).set('hour', hh ? +hh : 0).set('minute', mm ? +mm : 0).toISOString()
        }
        if (appointment) {
            return appointment.appointmentDate
        } else {
            return appointmentByKey ? fullDateString : '';
        }
    }, [appointmentByKey, appointment])

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

    return <TransportationNeeds onBack={handleBack} onNext={onNext} handleConsentsAccepted={checkPod} date={date}/>
};

export default TransportationsManage;