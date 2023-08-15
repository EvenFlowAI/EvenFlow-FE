import React from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    checkCarIsValid,
    clearAppointmentSteps,
    selectCategoriesIds,
    setAdditionalServicesChosen,
    setFrameDescription
} from '../../../store/reducers/appointmentFrameReducer/actions';
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useException, useModal} from "../../../utils/hooks";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../store/reducers/appointment/actions";
import AskAddService from "../../Modals/AskAddService/AskAddService";
import {useTranslation} from "react-i18next";
import AddCommentPrompt from "../../Modals/AddCommentPrompt/AddCommentPrompt";
import AskChangesCompleted from "../../Modals/AskChangesCompleted/AskChangesCompleted";
import SlotImpactedWarning from "../../Modals/SlotImpactedWarning/SlotImpactedWarning";
import {checkPodChanged} from "../../../store/reducers/appointments/actions";

type TProps = {
    handleSetScreen:TArgCallback<TScreen>;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices: () => void;
};

export const AddInfo: React.FC<TProps> = ({handleSetScreen, onAddServices}) => {
    const [
        subService,
        scProfile,
        service,
        categoriesIds,
        customerLoadedData,
        isUsualFlowNeeded,
    ] = useSelector(({appointmentFrame, appointment}: RootState) => [
        appointmentFrame.subService,
        appointment.scProfile,
        appointmentFrame.service,
        appointmentFrame.categoriesIds,
        appointment.customerLoadedData,
        appointmentFrame.isUsualFlowNeeded,
    ]);
    const {description} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isErrorOpen, onClose: onErrorClose, onOpen: onErrorOpen} = useModal();
    const {t} = useTranslation();
    const showError = useException();

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
        if (isCommentRequired && !description.length) {
            return onErrorOpen();
        }
        if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
            dispatch(checkCarIsValid(onCarIsValid, onCarIsInvalid))
        } else {
            onOpen()
        }
    }

    const removeLastCategory = () => {
        let categories = [...categoriesIds];
        categories.pop()
        dispatch(selectCategoriesIds(categories))
    }

    const clearData = () => {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps("serviceNeeds"));
    }

    const handleBack = () => {
        removeLastCategory();
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
                required={scProfile?.isCommentRequired}
                placeholder={t("Describe what`s going on")}
            />
            <Actions onBack={handleBack} onNext={onSubmit} nextLabel={t("Next")}/>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isOpen}/>
            <AskChangesCompleted/>
            <SlotImpactedWarning/>
            <AddCommentPrompt open={isErrorOpen} onClose={onErrorClose}/>
        </StepWrapper>
    );
};