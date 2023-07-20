import React, {useMemo} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearAppointmentSteps,
    selectCategoriesIds,
    setAdditionalServicesChosen,
    setFrameDescription
} from '../../../store/reducers/appointmentFrameReducer/actions';
import {TArgCallback} from "../../../types/types";
import {checkSelectedCar} from "./utils";
import {TScreen} from "../../Layout/types";
import {useModal} from "../../../utils/hooks";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {
    selectAppointment,
    selectServiceValetAppointment,
    selectSRMultiple
} from "../../../store/reducers/appointment/actions";
import AskAddService from "../../Modals/AskAddService/AskAddService";
import {useTranslation} from "react-i18next";
import {EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import AddCommentPrompt from "../../Modals/AddCommentPrompt/AddCommentPrompt";

type TProps = {
    handleSetScreen:TArgCallback<TScreen>;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices: () => void;
    currentConfig: TServiceTypeSettings|undefined;
};
export const AddInfo: React.FC<TProps> = ({handleSetScreen, onAddServices, currentConfig}) => {
    const [
        subService,
        vehicle,
        vehicles,
        scProfile,
        selectedSR,
        service,
        categoriesIds,
        allCategories,
        userType,
        isAdditionalServices,
    ] = useSelector(({appointmentFrame, appointment, categories}: RootState) => [
        appointmentFrame.subService,
        appointmentFrame.selectedVehicle,
        appointment.customerLoadedData?.vehicles,
        appointment.scProfile,
        appointment.selectedSR,
        appointmentFrame.service,
        appointmentFrame.categoriesIds,
        categories.allCategories,
        appointmentFrame.userType,
        appointmentFrame.isAdditionalServices,
    ]);
    const {description} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isErrorOpen, onClose: onErrorClose, onOpen: onErrorOpen} = useModal();
    const {t} = useTranslation();
    const screenToReturn = useMemo(() => subService ? 'serviceSelection' : 'serviceNeeds', [subService])

    const getScreenForNew = (): TScreen => {
        if (isAdditionalServices) {
            return getScreenForNew();
        } else {
            return 'maintenanceDetails';
        }
    }

    const getScreenForExisting = (): TScreen => {
        if (currentConfig?.advisorSelection) {
            return 'consultantSelection';
        } else {
            return currentConfig?.appointmentSelection
                ? 'appointmentTiming'
                : "appointmentSelection"
        }
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setFrameDescription(value))
    }

    const handleNext = () => {
        if (checkSelectedCar(vehicle, vehicles) || (vehicle?.mileage && userType === EUserType.Existing)) {
            handleSetScreen(getScreenForExisting());
        } else {
            handleSetScreen(getScreenForNew());
        }
    }

    const handleYes = () => {
        onClose();
        dispatch(setAdditionalServicesChosen(true));
        onAddServices();
    }

    const handleNo = () => {
        onClose();
        handleNext();
    }

    const onSubmit = () => {
        const isCommentRequired = subService ? subService?.isCommentRequired : service?.isCommentRequired;
        if (isCommentRequired && !description.length) {
            return onErrorOpen();
        }
        onOpen()
    }

    const filterCategories = () => {
        let categories = [...categoriesIds];
        // if (subService && categoriesIds?.includes(subService.id)) {
        //     categories = categoriesIds.filter(id => id !== subService?.id)
        // } else {
        //     if (service && categoriesIds?.includes(service.id)) {
        //         categories = categoriesIds.filter(id => id !== service?.id)
        //     }
        // }
        categories.pop()
        dispatch(selectCategoriesIds(categories))
    }

    const filterServiceRequests = () => {
        if (subService?.type === EServiceCategoryType.IndividualServices) {
            const diagnoseCategoryRequestsIds: number[] = allCategories
                .find(item => item.type === EServiceCategoryType.Diagnose)
                ?.serviceRequests.map(item => item.id) || [];
            const codes = selectedSR
                .filter(item => !subService.serviceRequests.find(el => item === el.id) || diagnoseCategoryRequestsIds.includes(item))
            dispatch(selectSRMultiple(codes));
        }
    }

    const handleBack = () => {
        filterCategories();
        // filterServiceRequests();
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps("serviceNeeds"));
        handleSetScreen(screenToReturn);
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
            <AddCommentPrompt open={isErrorOpen} onClose={onErrorClose}/>
        </StepWrapper>
    );
};