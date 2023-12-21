import React, {useCallback, useEffect, useMemo} from 'react';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {Actions} from '../../Actions/Actions';
import {IServiceConsultant} from '../../../../api/types';
import {
    loadConsultants,
    setAdvisor,
    setAnyAdvisorSelected,
    setCurrentFrameScreen,
    setServiceTypeOption,
    setSideBarActualSteps,
    setSideBarMenu,
    setSideBarStepsList
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/Loading/Loading";
import {selectAppointment, selectServiceValetAppointment,} from "../../../../store/reducers/appointment/actions";
import {EServiceCategoryType} from "../../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {
    getCurrentMenu,
    getStepsMap,
    getStepsScreen
} from "../utils";
import {useParams} from "react-router-dom";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {checkPodChanged} from "../../../../store/reducers/appointments/actions";
import {collectServiceRequestIds, decodeSCID, mapRecallsForRequest} from "../../../../utils/utils";
import {ConsultantsWrapper} from "./styles";
import {ConsultantCard} from "./ConsultantCard/ConsultantCard";
import {TActionProps} from "../../../../types/types";
import {useException} from "../../../../hooks/useException/useException";

export const Consultants: React.FC<TActionProps> = ({onNext, onBack}) => {
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
        serviceOptionChangedFromSlotPage,
        prevSelectedOption
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR, customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {allCategories} = useSelector((state: RootState) => state.categories);
    const {isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const {id} = useParams();
    const {t} = useTranslation();
    const showError = useException();
    const isGoingFromManageScreen = customerLoadedData?.isUpdating && !serviceOptionChangedFromSlotPage;

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

    useEffect(() => {
        dispatch(loadConsultants(id, serviceTypeOption?.id ?? null, onNext))
    }, [id, serviceRequestIds, selectedVehicle, getCategories, mapRecallsForRequest, packageEMenuType, packagePricingType, selectedPackage, serviceTypeOption])

    useEffect(() => {
        dispatch(setSideBarMenu(getCurrentMenu(serviceType, isAdvisorAvailable, isTransportationAvailable, Boolean(customerLoadedData?.isUpdating))))
    }, [serviceType, isAdvisorAvailable, isTransportationAvailable, getCurrentMenu])

    useEffect(() => {
        dispatch(setSideBarActualSteps(getStepsMap(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
        dispatch(setSideBarStepsList(getStepsScreen(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, Boolean(customerLoadedData?.isUpdating))))
    }, [serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, getStepsMap, getStepsScreen])

    const handleSelectConsultant = (consultant: IServiceConsultant|null) => () => {
        dispatch(setAdvisor(consultant));
        dispatch(setAnyAdvisorSelected(!Boolean(consultant)))
        if (!customerLoadedData?.isUpdating) {
            dispatch(selectAppointment(null));
          //  dispatch(setWaitListSettings(null));
            dispatch(selectServiceValetAppointment(null));
        }
    }

    const handleNext = () => {
        if (isGoingFromManageScreen) {
            dispatch(checkPodChanged(decodeSCID(id), showError))
        } else onNext()
    }

    const onBackToPrevServiceOption = () => {
        if (prevSelectedOption) dispatch(setServiceTypeOption(prevSelectedOption))
        dispatch(setCurrentFrameScreen("appointmentSelection"))
    }

    const handleBack = () => {
        isGoingFromManageScreen
            ? dispatch(setCurrentFrameScreen("manageAppointment"))
            : serviceOptionChangedFromSlotPage && customerLoadedData?.isUpdating
                ? onBackToPrevServiceOption()
                : onBack()
    }

    return (<StepWrapper>
        {isConsultantsLoading || !isAdvisorAvailable
            ? <div style={{display: 'flex', justifyContent: 'center', width: "100%"}}><Loading/></div>
            : <ConsultantsWrapper>
                <ConsultantCard
                    blank
                    onClick={handleSelectConsultant(null)}
                    active={selectedConsultant === null}
                />
                {consultants.map(c =>
                    <ConsultantCard
                        onClick={handleSelectConsultant(c)}
                        advisor={c}
                        key={c.id}
                        active={selectedConsultant?.id === c.id} />
                )}
            </ConsultantsWrapper>
        }
        <Actions onNext={handleNext} onBack={handleBack} nextLabel={t("Next")}/>
    </StepWrapper>);
};