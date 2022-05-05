import React, { useMemo } from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    selectCategoriesIds,
    setAdditionalServicesChosen,
    setFrameDescription
} from '../../../store/reducers/appointmentFrameReducer/actions';
import {TArgCallback, TCallback} from "../../../types/types";
import {checkSelectedCar} from "./utils";
import {TScreen} from "../../../components/Layout/types";
import {useModal} from "../../../utils/hooks";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {selectSRMultiple} from "../../../store/reducers/appointment/actions";
import AskAddService from "../../Modals/AskAddService/AskAddService";

type TProps = {
    onFillCar: TCallback;
    onBack: TArgCallback<TScreen>;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices: () => void;
};
export const AddInfo: React.FC<TProps> = ({onNext, onBack, onFillCar, onAddServices}) => {
    const [
        subService,
        vehicle,
        vehicles,
        selectedPackage,
        selectedSR,
        service,
        categoriesIds,
        allCategories
    ] = useSelector(({appointmentFrame, appointment, categories}: RootState) => [
        appointmentFrame.subService,
        appointmentFrame.selectedVehicle,
        appointment.customerLoadedData?.vehicles,
        appointmentFrame.selectedPackage,
        appointment.selectedSR,
        appointmentFrame.service,
        appointmentFrame.categoriesIds,
        categories.allCategories,
    ]);
    const {description} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const screenToReturn = useMemo(() => subService ? 'serviceSelection' : 'serviceNeeds', [subService])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setFrameDescription(value))
    }

    const handleNext = () => {
        if (!checkSelectedCar(vehicle, vehicles)) {
            onFillCar();
        } else {
            onNext();
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
        if (!selectedPackage || !selectedSR.length) {
            onOpen()
        } else handleNext()
    }

    const handleCategories = () => {
        let categories = [...categoriesIds];
        if (subService && categoriesIds?.includes(subService.id)) {
            categories = categoriesIds.filter(id => id !== subService?.id)
        } else {
            if (service && categoriesIds?.includes(service.id)) {
                categories = categoriesIds.filter(id => id !== service?.id)
            }
        }
        dispatch(selectCategoriesIds(categories))
    }

    const handleServiceRequests = () => {
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
        handleCategories();
        handleServiceRequests();
        onBack(screenToReturn);
    }

    return (
        <StepWrapper>
            <TextField
                fullWidth
                multiline
                onChange={handleChange}
                value={description}
                rows={4}
                placeholder="Describe what`s going on"
            />
            <Actions onBack={handleBack} onNext={onSubmit} />
            <AskAddService onSave={handleYes} onClose={handleNo} open={isOpen}/>
        </StepWrapper>
    );
};