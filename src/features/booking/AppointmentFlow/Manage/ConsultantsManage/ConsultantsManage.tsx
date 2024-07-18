import React from 'react';
import {TCallback, TScreen} from "../../../../../types/types";
import {
    setAdvisor, setAnyAdvisorSelected,
    setCurrentFrameScreen,
    setServiceTypeOption, setTransportation
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {checkPodChanged} from "../../../../../store/reducers/appointments/actions";
import {decodeSCID} from "../../../../../utils/utils";
import {IServiceConsultant} from "../../../../../api/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useException} from "../../../../../hooks/useException/useException";
import {Consultants} from "../../Screens/Consultants/Consultants";

const ConsultantsManage: React.FC<{onNext: TCallback}> = ({onNext}) => {
    const {
        serviceOptionChangedFromSlotPage,
        prevSelectedOption,
        editingPosition,
        appointmentByKey
    } = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const showError = useException();

    const handleSelectConsultant = (consultant: IServiceConsultant|null) => {
        dispatch(setAdvisor(consultant));
        dispatch(setAnyAdvisorSelected(!Boolean(consultant)))
    }

    const restoreOriginalTransportation = () => {
        if (appointmentByKey?.transportationOption) {
            dispatch(setTransportation(appointmentByKey?.transportationOption))
        }
    }

    const restoreToPrevServiceOption = () => {
        if (prevSelectedOption) {
            dispatch(setServiceTypeOption(prevSelectedOption))
            restoreOriginalTransportation()
        }
        const nextScreen: TScreen = editingPosition === "slot" || editingPosition === "transportation"
            ? "manageAppointment"
            : 'appointmentSelection'
        dispatch(setCurrentFrameScreen(nextScreen))
    }

    const handleBack = () => {
        serviceOptionChangedFromSlotPage
            ? restoreToPrevServiceOption()
            : dispatch(setCurrentFrameScreen("manageAppointment"))
    }

    const handleNext = () => {
        if (editingPosition === 'advisor') {
            dispatch(checkPodChanged(decodeSCID(id), showError))
        } else {
            onNext()
        }
    }

    return <Consultants
        onNext={onNext}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSelectConsultant={handleSelectConsultant}/>;
};

export default ConsultantsManage;