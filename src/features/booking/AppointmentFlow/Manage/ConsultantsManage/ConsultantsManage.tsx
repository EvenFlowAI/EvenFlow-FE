import React from 'react';
import {TCallback} from "../../../../../types/types";
import {
    setAdvisor, setAnyAdvisorSelected,
    setCurrentFrameScreen,
    setServiceTypeOption
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
        editingPosition
    } = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const showError = useException();

    const handleSelectConsultant = (consultant: IServiceConsultant|null) => {
        dispatch(setAdvisor(consultant));
        dispatch(setAnyAdvisorSelected(!Boolean(consultant)))
    }
    const onBackToPrevServiceOption = () => {
        if (prevSelectedOption) dispatch(setServiceTypeOption(prevSelectedOption))
        dispatch(setCurrentFrameScreen("appointmentSelection"))
    }

    const handleBack = () => {
        serviceOptionChangedFromSlotPage
            ? onBackToPrevServiceOption()
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