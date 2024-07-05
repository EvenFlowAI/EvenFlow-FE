import React, {useMemo} from 'react';
import {TActionProps} from "../../../../types/types";
import {TransportationNeeds} from "../../TransportationNeeds/TransportationNeeds";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setCurrentFrameScreen, setTransportation} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {setChangesCompletedOpen} from "../../../../store/reducers/modals/actions";
import dayjs from "dayjs";

const TransportationsManage: React.FC<TActionProps> = ({onBack, onNext}) => {
    const {isUsualFlowNeeded, appointmentByKey} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const {appointment} = useSelector(({appointment}: RootState) => appointment)
    const dispatch = useDispatch();

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
        if (!isUsualFlowNeeded) {
            dispatch(setCurrentFrameScreen("manageAppointment"))
        } else {
            dispatch(setTransportation(null));
            onBack();
        }
    }

    const handleConsentsAccepted = () => {
        dispatch(setChangesCompletedOpen(true))
    }

    return <TransportationNeeds onBack={handleBack} onNext={onNext} handleConsentsAccepted={handleConsentsAccepted} date={date}/>
};

export default TransportationsManage;