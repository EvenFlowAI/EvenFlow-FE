import React, {useCallback, useEffect, useMemo} from 'react';
import {StepWrapper} from "../../../../../components/styled/StepWrapper";
import {ActionButtons} from '../../../ActionButtons/ActionButtons';
import {IServiceConsultant} from '../../../../../api/types';
import {
    checkCarIsValid,
    loadConsultants,
    setSideBarActualSteps,
    setSideBarMenu,
    setSideBarStepsList
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {
    getCurrentMenu,
    getStepsMap,
    getStepsScreen
} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {collectServiceRequestIds, mapRecallsForRequest} from "../../../../../utils/utils";
import {ConsultantsWrapper} from "./styles";
import {ConsultantCard} from "./ConsultantCard/ConsultantCard";
import {TArgCallback} from "../../../../../types/types";

type TProps = {
    isManagingFlow?: boolean;
    handleNext: () => void;
    handleBack: () => void;
    handleSelectConsultant: TArgCallback<IServiceConsultant|null>;
    onNext: () => void;
}

export const Consultants: React.FC<TProps> = ({isManagingFlow, handleNext, handleBack, handleSelectConsultant, onNext}) => {
    const {
        advisor: selectedConsultant,
        consultants,
        selectedPackage,
        service,
        subService,
        categoriesIds,
        selectedVehicle,
        packagePricingType,
        serviceTypeOption,
        packageEMenuType,
        isConsultantsLoading,
        selectedRecalls,
        address,
        zipCode,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR, customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {allCategories} = useSelector((state: RootState) => state.categories);
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const {t} = useTranslation();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(service, subService, null, selectedSR);
    }, [service, subService, selectedSR]);

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    const onCarIsValid = useCallback(() => {
        const someRequestsSelected = selectedSR.length || selectedPackage || categoriesIds.length || selectedRecalls.length;
        const requestDataIsValid = serviceTypeOption?.type === EServiceType.VisitCenter || Boolean(address && zipCode)
        if (someRequestsSelected && requestDataIsValid && !customerLoadedData?.isUpdating) {
            dispatch(loadConsultants(id, serviceTypeOption?.id ?? null, onNext));
        }
    }, [selectedSR, selectedPackage, categoriesIds, selectedRecalls, serviceTypeOption, id, address, zipCode, customerLoadedData])

    useEffect(() => {
        dispatch(checkCarIsValid(onCarIsValid, undefined, true))
    }, [serviceTypeOption, id, selectedSR, selectedPackage, categoriesIds, selectedRecalls, selectedVehicle, mileage])

    // useEffect(() => {
    //     dispatch(loadConsultants(id, serviceTypeOption?.id ?? null, onNext))
    // }, [id, serviceRequestIds, selectedVehicle, getCategories, mapRecallsForRequest, packageEMenuType, packagePricingType, selectedPackage, serviceTypeOption])

    useEffect(() => {
        dispatch(setSideBarMenu(getCurrentMenu(serviceType, isAdvisorAvailable, isTransportationAvailable, Boolean(isManagingFlow))))
    }, [serviceType, isAdvisorAvailable, isTransportationAvailable, getCurrentMenu])

    useEffect(() => {
        dispatch(setSideBarActualSteps(getStepsMap(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
        dispatch(setSideBarStepsList(getStepsScreen(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, Boolean(isManagingFlow))))
    }, [serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, getStepsMap, getStepsScreen])

    const onClick = (c: IServiceConsultant|null) => {
        handleSelectConsultant(c)
    }

    return (<StepWrapper>
        {isConsultantsLoading || !isAdvisorAvailable
            ? <div style={{display: 'flex', justifyContent: 'center', width: "100%"}}><Loading/></div>
            : <ConsultantsWrapper>
                <ConsultantCard
                    blank
                    onClick={() => onClick(null)}
                    active={selectedConsultant === null}
                />
                {consultants.map(c =>
                    <ConsultantCard
                        onClick={() => onClick(c)}
                        advisor={c}
                        key={c.id}
                        active={selectedConsultant?.id === c.id} />
                )}
            </ConsultantsWrapper>
        }
        <ActionButtons onNext={handleNext} onBack={handleBack} nextLabel={t("Next")}/>
    </StepWrapper>);
};