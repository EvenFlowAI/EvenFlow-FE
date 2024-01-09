import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import {CarCard} from "./CarCard/CarCard";
import {useMediaQuery, useTheme} from "@material-ui/core";
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {TArgCallback, TCallback, TScreen} from "../../../../types/types";
import {StepWrapper} from '../../../../components/styled/StepWrapper';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {ILoadedVehicle} from "../../../../api/types";
import {
    clearAppointmentData,
    setAppointmentByKey,
    setCurrentFrameScreen,
    setEditingPosition,
    setHashKey,
    setServiceOptionChanged,
    setServiceTypeOption,
    setSideBarSteps,
    setVehicle,
    setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {getBlankVehicle, selectSR, setCustomerLoadedData} from "../../../../store/reducers/appointment/actions";
import {useHistory, useParams} from "react-router-dom";
import {Arrow, CarsWrapper, Info} from "./styles";
import {AppointmentScreenTitle} from "../../../../components/wrappers/AppointmentScreenTitle/AppointmentScreenTitle";
import {checkSelectedCar} from "./utils";
import {useException} from "../../../../hooks/useException/useException";
import {Routes} from "../../../../routes/constants";

type TProps = {
    onBack: TCallback;
    loading: boolean;
    needToShowServiceSelection: boolean;
    handleSetScreen: TArgCallback<TScreen>;
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    onUpdateAppointment: (car: ILoadedVehicle) => Promise<void>;
}

export const Cars: React.FC<TProps> = ({
                                                              onUpdateAppointment, onBack, loading, handleSetScreen,
                                                              needToShowServiceSelection, setNeedToShowServiceSelection
                                                          }) => {

    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {
        selectedVehicle,
        valueService,
        serviceTypeOption,
        consultants,
        makes,
        isUsualFlowNeeded
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const { isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const [idx, setIdx] = useState<number>(0);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const showError = useException();
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();

    const vehiclesPerScreen = useMemo(() => {
        return isXs ? 1 : 2;
    }, [isXs]);

    const next = () => {
        if (!nextDisabled()) {
            setIdx(p => p + 1);
        }
    }
    const prev = () => {
        if (!prevDisabled()) {
            setIdx(p => p - 1);
        }
    }

    const getNextScreen = useCallback((): TScreen => {
        let nextScreen: TScreen = serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
        if (valueService?.selectedService) {
            nextScreen = isAdvisorAvailable
                ? 'consultantSelection'
                : 'appointmentTiming'
        }
        return nextScreen;
    }, [serviceType, valueService, isAdvisorAvailable, consultants])

    useEffect(() => {
        if (customerLoadedData && (!customerLoadedData.vehicles?.length || customerLoadedData?.fromSearchByName)) {
            if (needToShowServiceSelection) {
                setNeedToShowServiceSelection(false);
                handleServiceTypeSelection()
            } else {
                if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
                    handleSetScreen("manageAppointment")
                } else handleSetScreen(getNextScreen());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerLoadedData, selectedVehicle, scProfile, needToShowServiceSelection]);

    const nextDisabled = () => idx >= (customerLoadedData?.vehicles.length ?? 0) - vehiclesPerScreen;
    const prevDisabled = () => idx <= 0;

    const isSelected = (vehicle: ILoadedVehicle) => {
        if (!selectedVehicle) {
            return false;
        }
        if (!selectedVehicle.vin) {
            return selectedVehicle.make === vehicle.make
                && selectedVehicle.model === vehicle.model
                && selectedVehicle.year === vehicle.year;
        }
        return selectedVehicle.vin === vehicle.vin;
    }

    const clearAllData = useCallback(() => {
        dispatch(clearAppointmentData())
        dispatch(setServiceTypeOption(null))
        dispatch(setSideBarSteps([]));
        dispatch(setServiceOptionChanged(false));
    },[])

    const clearData = useCallback(() => {
        dispatch(setVehicle(getBlankVehicle()));
        clearAllData()
    }, [clearAllData])

    const handleServiceTypeSelection = useCallback(() => {
        if (needToShowServiceSelection) {
            setNeedToShowServiceSelection(false);
            dispatch(setWelcomeScreenView('serviceSelect'))
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        }
    }, [history, needToShowServiceSelection])

    const handleAddNewCarAppointment = useCallback((vehicle: ILoadedVehicle) => {
        clearAllData();
        dispatch(setVehicle(vehicle));
        if (needToShowServiceSelection) {
            handleServiceTypeSelection()
        } else {
            handleSetScreen(serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location');
        }
    }, [dispatch, handleSetScreen, needToShowServiceSelection, serviceType, handleServiceTypeSelection, clearAllData]);

    const handleFirstScreen = useCallback(() => {
        setNeedToShowServiceSelection(false);
        dispatch(setWelcomeScreenView('serviceSelect'))
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }, [history, id])

    const handleAddNewVehicle = useCallback(() => {
        clearData()
        if (firstScreenOptions.length) {
            const onlyNotVisitCenterExists = firstScreenOptions.length === 1 && firstScreenOptions[0].type !== EServiceType.VisitCenter;
            if (firstScreenOptions.length > 1 || onlyNotVisitCenterExists) {
                handleFirstScreen()
            } else {
                dispatch(setServiceTypeOption(firstScreenOptions[0]))
                handleSetScreen(serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location');
            }
        } else {
            handleSetScreen(serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location');
        }
    }, [dispatch, handleSetScreen, firstScreenOptions, handleFirstScreen]);

    const onSelectCar = useCallback(async (car: ILoadedVehicle) => {
        dispatch(selectSR(null));
        clearAllData()
        if (car?.appointmentHashKeys.length) {
            customerLoadedData && dispatch(setCustomerLoadedData({...customerLoadedData, isUpdating: true}))
            await onUpdateAppointment(car)
            dispatch(setCurrentFrameScreen("manageAppointment"))
        } else {
            dispatch(setHashKey(''));
            dispatch(setAppointmentByKey(null));
            dispatch(setEditingPosition(null));
            if (needToShowServiceSelection) {
                handleServiceTypeSelection()
            } else {
                handleSetScreen(getNextScreen());
            }
        }
    }, [handleSetScreen, showError, dispatch, firstScreenOptions, makes, scProfile, onUpdateAppointment, needToShowServiceSelection, selectedVehicle]);

    const onNext = useCallback( () => {
        selectedVehicle && onSelectCar(selectedVehicle)
    }, [selectedVehicle, onSelectCar]);

    return (
        <StepWrapper>
            <AppointmentScreenTitle>{t("Which vehicle are you coming in for?")}</AppointmentScreenTitle>
            <CarsWrapper>
                {customerLoadedData?.vehicles.length ?
                    <>
                        <Arrow onClick={prev} disabled={prevDisabled()}>
                            <ChevronLeft />
                            <span className="text" style={{left: isSm ? -6 : -27}}>Previous Vehicle</span>
                        </Arrow>
                        {customerLoadedData.vehicles
                            .slice(idx, idx + vehiclesPerScreen)
                            .map((vehicle, index) =>
                                <CarCard
                                    hasOrders={vehicle.hasRepairOrders}
                                    onNext={onNext}
                                    onSelectCar={onSelectCar}
                                    onAddNewAppointment={handleAddNewCarAppointment}
                                    selected={isSelected(vehicle)}
                                    clearData={clearData}
                                    car={vehicle}
                                    key={vehicle.dmsId || new Date().toISOString() + index}/>
                            )}
                        <Arrow onClick={next} disabled={nextDisabled()}>
                            <ChevronRight />
                            <span className="text" style={{left: isSm ? -4 : -13}}>Next Vehicle</span>
                        </Arrow>
                    </> : <p>{t("No vehicles present")}</p>
                }
            </CarsWrapper>
            <Info>
                {t("Click here to")} <span onClick={handleAddNewVehicle}>{t("add new vehicle")}</span>
            </Info>
            <ActionButtons
                hideNext
                onBack={onBack}
                nextLabel={t("Next")}
                onNext={onNext}
                nextDisabled={!selectedVehicle
                    || !checkSelectedCar(selectedVehicle, customerLoadedData?.vehicles)}
                loading={loading} />
        </StepWrapper>
    );
};