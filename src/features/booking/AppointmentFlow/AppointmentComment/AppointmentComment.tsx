import React, {useEffect, useRef} from 'react';
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {TextField} from "../../../../components/styled/EndUserInputs";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    checkCarIsValid,
    clearAppointmentSteps,
    setAdditionalServicesChosen,
    setFrameDescription
} from '../../../../store/reducers/appointmentFrameReducer/actions';
import {TArgCallback, TScreen} from "../../../../types/types";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../store/reducers/appointment/actions";
import AskAddService from "../../../../components/modals/booking/AskAddService/AskAddService";
import {useTranslation} from "react-i18next";
import AddCommentPrompt from "./AddCommentPrompt/AddCommentPrompt";
import {checkPodChanged} from "../../../../store/reducers/appointments/actions";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useException} from "../../../../hooks/useException/useException";

type TProps = {
    handleSetScreen:TArgCallback<TScreen>;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices: () => void;
    isManagingFlow?: boolean;
};

export const AppointmentComment: React.FC<TProps> = ({isManagingFlow, handleSetScreen, onAddServices}) => {
    const {
        subService,
        service,
        description} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isErrorOpen, onClose: onErrorClose, onOpen: onErrorOpen} = useModal();
    const {t} = useTranslation();
    const showError = useException();
    const ref = useRef<HTMLDivElement|null>(null)

    useEffect(() => {
        if (ref) ref.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [ref])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setFrameDescription(value))
    }

    const handleYes = () => {
        onClose();
        dispatch(setAdditionalServicesChosen(true));
        onAddServices();
    }

    const handleNo = () => {
        onClose();
        handleSetScreen('maintenanceDetails');
    }

    const onCarIsValid = () => scProfile && dispatch(checkPodChanged(scProfile.id, showError));

    const onCarIsInvalid = () => handleSetScreen('maintenanceDetails');

    const onSubmit = () => {
        const isCommentRequired = subService ? subService?.isCommentRequired : service?.isCommentRequired;
        if (!description.trim().length) {
            if (isCommentRequired) {
                return onErrorOpen();
            } else {
                dispatch(setFrameDescription(''))
            }
        }
        if (isManagingFlow) {
            dispatch(checkCarIsValid(onCarIsValid, onCarIsInvalid))
        } else {
            onOpen()
        }
    }

    const clearData = () => {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps("serviceNeeds"));
    }

    const handleBack = () => {
        clearData();
        handleSetScreen("serviceNeeds");
    }

    return (
        <StepWrapper>
            <TextField
                fullWidth
                multiline
                onChange={handleChange}
                value={description}
                rows={4}
                variant="standard"
                InputProps={{disableUnderline: true}}
                required={scProfile?.isCommentRequired}
                placeholder={t("Describe what`s going on")}
            />
            <ActionButtons onBack={handleBack} onNext={onSubmit} nextLabel={t("Next")}/>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isOpen}/>
            <AddCommentPrompt open={isErrorOpen} onClose={onErrorClose}/>
        </StepWrapper>
    );
};