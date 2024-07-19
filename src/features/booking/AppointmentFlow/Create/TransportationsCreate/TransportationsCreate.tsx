import React from 'react';
import {TActionProps} from "../../../../../types/types";
import {TransportationNeeds} from "../../Screens/TransportationNeeds/TransportationNeeds";
import {setTransportation} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";

const TransportationsCreate: React.FC<TActionProps> = ({onBack, onNext}) => {
    const {appointment} = useSelector(({appointment}: RootState) => appointment)
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(setTransportation(null));
        onBack();
    }

    return <TransportationNeeds
        onBack={handleBack}
        onNext={onNext}
        handleConsentsAccepted={onNext}
        date={appointment?.appointmentDate ?? ''}/>
};

export default TransportationsCreate;