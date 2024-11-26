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
import {useTranslation} from "react-i18next";
import {
    getCurrentMenu,
    getStepsMap,
    getStepsScreen
} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
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
        categoriesIds,
        selectedVehicle,
        serviceTypeOption,
        isConsultantsLoading,
        selectedRecalls,
        address,
        zipCode,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR, customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const {t} = useTranslation();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

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