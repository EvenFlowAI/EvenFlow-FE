import React from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearAppointmentSteps, createOrUpdateAppointment,
    selectCategoriesIds,
    setAdditionalServicesChosen, setCurrentFrameScreen,
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
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../utils/utils";

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
    ] = useSelector(({appointmentFrame, appointment}: RootState) => [
        appointmentFrame.subService,
        appointment.scProfile,
        appointmentFrame.service,
        appointmentFrame.categoriesIds,
        appointment.customerLoadedData,
    ]);
    const {description} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isErrorOpen, onClose: onErrorClose, onOpen: onErrorOpen} = useModal();
    const {isOpen: isChangesCompletedOpen, onClose: onChangesCompletedClose, onOpen: onChangesCompletedOpen} = useModal();
    const {isOpen: isSlotsWarningOpen, onClose: onSlotsWarningClose, onOpen: onSlotsWarningOpen} = useModal();
    const {t} = useTranslation();
    const {id} = useParams();
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

    const onSubmit = () => {
        const isCommentRequired = subService ? subService?.isCommentRequired : service?.isCommentRequired;
        if (isCommentRequired && !description.length) {
            return onErrorOpen();
        }
        if (customerLoadedData?.isUpdating) {
            // todo request to get pod
            onChangesCompletedOpen()
            //onSlotsWarningOpen()
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

    const onSuccessAppointmentUpdate = () => {
        onChangesCompletedClose()
        dispatch(setCurrentFrameScreen("appointmentConfirmed"))
    }

    const handleChangesCompleted = async () => {
        dispatch(createOrUpdateAppointment(decodeSCID(id), onSuccessAppointmentUpdate, showError))
    }

    const handleAdditionalChanges = () => {
        onChangesCompletedClose()
        dispatch(setCurrentFrameScreen("manageAppointment"))
    }

    const onSlotsWarningClick = () => {
        onSlotsWarningClose();
        dispatch(setCurrentFrameScreen("appointmentSelection"));
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
            <AskChangesCompleted
                onClose={onChangesCompletedClose}
                onSave={handleChangesCompleted}
                onAdditionalChanges={handleAdditionalChanges}
                open={isChangesCompletedOpen}
                onCancel={onChangesCompletedClose}
            />
            <SlotImpactedWarning open={isSlotsWarningOpen} onClose={onSlotsWarningClick} onClick={onSlotsWarningClick}/>
            <AddCommentPrompt open={isErrorOpen} onClose={onErrorClose}/>
        </StepWrapper>
    );
};