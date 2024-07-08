import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Cars} from "../../../features/booking/AppointmentFlow/Screens/Cars/Cars";
import {
    AppointmentConfirmation
} from '../../../features/booking/AppointmentFlow/Create/AppointmentConfirmation/AppointmentConfirmation';
import {AppointmentComment} from "../../../features/booking/AppointmentFlow/Screens/AppointmentComment/AppointmentComment";
import {
    MaintenancePackages
} from "../../../features/booking/AppointmentFlow/Screens/MaintenancePackages/MaintenancePackages";
import {SelectOpsCode} from "../../../features/booking/AppointmentFlow/Screens/ServiceOpsCodes/SelectOpsCode";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearCustomerCache,
    setCustomerLoadedData,
} from "../../../store/reducers/appointment/actions";
import {encodeSCID} from "../../../utils/utils";
import {
    AppointmentConfirmed
} from "../../../features/booking/AppointmentFlow/Screens/AppointmentConfirmed/AppointmentConfirmed";
import {
    handleAppointmentUpdate,
    setCurrentFrameScreen,
    setServiceTypeOption,
    setWelcomeScreenView,
    updatePackageOption,
    updateRecalls
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {EServiceCategoryPage, IAppointmentByKey, ILoadedVehicle, IServiceCategory} from "../../../api/types";
import './AppointmentFlow.css';
import PaymentScreen from "../../../features/booking/AppointmentFlow/Screens/PaymentScreen/PaymentScreen";
import OfferProductPage from "../../../features/booking/AppointmentFlow/Screens/OfferProductPage/OfferProductPage";
import {setTransportationAvailable} from "../../../store/reducers/bookingFlowConfig/actions";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {TMobileScreen, TScreen, TView} from "../../../types/types";
import {useException} from "../../../hooks/useException/useException";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../routes/constants";
import YourLocationManage from "../../../features/booking/AppointmentFlow/Manage/YourLocationManage/YourLocationManage";
import TransportationsManage
    from "../../../features/booking/AppointmentFlow/Manage/TransportationsManage/TransportationsManage";
import AppointmentSlotsManage
    from "../../../features/booking/AppointmentFlow/Manage/AppointmentSlotsManage/AppointmentSlotsManage";
import AppointmentTimingManage
    from "../../../features/booking/AppointmentFlow/Manage/AppointmentTimingManage/AppointmentTimingManage";
import ConsultantsManage from "../../../features/booking/AppointmentFlow/Manage/ConsultantsManage/ConsultantsManage";
import MaintenanceManage from "../../../features/booking/AppointmentFlow/Manage/MaintenanceManage/MaintenanceManage";
import {
    ServiceNeedsManage
} from "../../../features/booking/AppointmentFlow/Manage/ServiceNeedsManage/ServiceNeedsManage";
import Appointment from "../Appointment/Appointment";

export const ManageAppointmentFlow = () => {
    const {
        selectedVehicle,
        makes,
        serviceTypeOption,
        isUsualFlowNeeded,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [currentScreen, setCurrentScreen] = useState<TScreen | TMobileScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);
    const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory|null>(null);
    const [needToShowServiceTypes, setNeedToShowServiceTypes] = useState<boolean>(false)
    const [serviceCategoryPage, setServiceCategoryPage] = useState<EServiceCategoryPage>(EServiceCategoryPage.Page1);

    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const dispatch = useDispatch();
    const showError = useException();
    const currentUser = useCurrentUser();

    const isAuth = useMemo(() => currentUser?.dealershipId === scProfile?.dealershipId, [currentUser, scProfile]);

    const onGoToFirstScreen = useCallback((screen: TView) => {
        dispatch(setWelcomeScreenView(screen))
        if (id) {
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        } else if (scProfile?.id) {
            history.push(Routes.EndUser.Welcome + "/" + encodeSCID(scProfile?.id) + "?frame=1");
        }
    }, [id, history, dispatch, scProfile])

    const handleLogin = useCallback(() => {
        clearCustomerCache();
        dispatch(setCustomerLoadedData(null));
        onGoToFirstScreen("select");
    }, [onGoToFirstScreen]);

    const handleSetScreen = useCallback((screen: TScreen) => {
        setCurrentScreen(screen);
        dispatch(setCurrentFrameScreen(screen));
    }, []);

    const handleTransportationScreen = (option:IFirstScreenOption) => {
        if (option.transportationOption) {
            dispatch(setTransportationAvailable(false));
        }
    }

    const handleServiceTypeOption = useCallback((data:IAppointmentByKey) => {
        let needToShowService = needToShowServiceTypes;
        if (data.serviceTypeOption) {
            const optionExists = Boolean(firstScreenOptions.find(item => item.id === data.serviceTypeOption?.id))
            if (optionExists) {
                needToShowService = false;
                dispatch(setServiceTypeOption(data.serviceTypeOption));
                handleTransportationScreen(data.serviceTypeOption);
            }
        }
        setNeedToShowServiceTypes(needToShowService)
    }, [needToShowServiceTypes, firstScreenOptions])

    const goToServiceTypeSelection = useCallback(() => {
        if (needToShowServiceTypes) {
            setNeedToShowServiceTypes(false);
            dispatch(setWelcomeScreenView('serviceSelect'))
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        }
    }, [history, needToShowServiceTypes])

    const onUpdateAppointment = useCallback(async(car: ILoadedVehicle) => {
        dispatch(handleAppointmentUpdate(car, setLoadingCar, setServiceCategoryPage, isAuth, id, handleServiceTypeOption, showError))
    }, [handleSetScreen, showError, dispatch, firstScreenOptions, makes, scProfile,
        handleServiceTypeOption, needToShowServiceTypes, serviceTypeOption, id,
        updateRecalls, updatePackageOption, goToServiceTypeSelection,
        isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable,
        selectedVehicle, engineTypes, isAuth])

    useEffect(() => {
        if (selectedVehicle && customerLoadedData?.isUpdating && customerLoadedData.fromSearchByName) {
            dispatch(setCustomerLoadedData({...customerLoadedData, fromSearchByName: false}))
            onUpdateAppointment(selectedVehicle).then(() => handleSetScreen("manageAppointment"))
        }
    }, [customerLoadedData, selectedVehicle])

    const onSelectAppointment = async (car: ILoadedVehicle) => {
        customerLoadedData && dispatch(setCustomerLoadedData({...customerLoadedData, isUpdating: true}))
        await onUpdateAppointment(car)
        dispatch(setCurrentFrameScreen("manageAppointment"))
    }

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
        dispatch(setCurrentFrameScreen(name));
    }, []);

    const component = useMemo(() => {
        const carSelections: {[k in TScreen]?: JSX.Element} = {
            carSelection: <Cars
                onBack={handleLogin}
                loading={loadingCar}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                needToShowServiceSelection={needToShowServiceTypes}
                handleSetScreen={handleSetScreen}
                onSelectAppointment={onSelectAppointment}/>,
            serviceNeeds: <ServiceNeedsManage
                page={serviceCategoryPage}
                setPage={setServiceCategoryPage}
                setLastSelectedCategory={setLastSelectedCategory}
                onSelect={handleSetScreen} />,
            maintenanceDetails: <MaintenanceManage
                serviceCategoryPage={serviceCategoryPage}
                onBack={handleSetScreen}
                onNext={handleSetScreen}
            />,
            packageSelection: <MaintenancePackages
                isManagingFlow={!isUsualFlowNeeded}
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            describeMore: <AppointmentComment
                handleSetScreen={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
                isManagingFlow={!isUsualFlowNeeded}
            />,
            opsCode: <SelectOpsCode
                onAddServices={handleChangeScreen('serviceNeeds')}
                handleSetScreen={handleSetScreen}
                page={serviceCategoryPage}
                isManagingFlow={!isUsualFlowNeeded}
            />,
            consultantSelection: <ConsultantsManage
                onNext={handleChangeScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : "appointmentSelection")}
            />,
            appointmentTiming: <AppointmentTimingManage handleSetScreen={handleSetScreen}/>,
            appointmentSelection: <AppointmentSlotsManage handleSetScreen={handleSetScreen}/>,
            transportationNeeds: <TransportationsManage
                onBack={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmation')}
            />,
            appointmentConfirmation: <AppointmentConfirmation
                onBack={handleChangeScreen(isTransportationAvailable && !serviceTypeOption?.transportationOption
                    ? 'transportationNeeds'
                    : 'appointmentSelection')}
                onChangeSlot={handleChangeScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : "appointmentSelection")}
                onNext={handleChangeScreen('appointmentConfirmed')}
            />,
            appointmentConfirmed: <AppointmentConfirmed onUpdateAppointment={onUpdateAppointment}/>,
            location: <YourLocationManage
                onUpdateAppointment={onUpdateAppointment}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                onGoToFirstScreen={onGoToFirstScreen}
            />,
            payment: <PaymentScreen/>,
            serviceOfferProductPage: <OfferProductPage
                handleSetScreen={handleSetScreen}
                category={lastSelectedCategory}
                lastCategory={lastSelectedCategory}
                onChangeVehicle={handleChangeScreen('maintenanceDetails')}
            />,
        }
        return carSelections[currentScreen];

    }, [currentScreen, handleChangeScreen, handleSetScreen, handleLogin, loadingCar, serviceTypeOption,
        needToShowServiceTypes, onUpdateAppointment, serviceCategoryPage, isTransportationAvailable,
        isAdvisorAvailable, isAppointmentTimingAvailable]);

    return (
        <Appointment
            handleLogin={handleLogin}
            currentScreen={currentScreen}
            component={component}
            setNeedToShowServiceTypes={setNeedToShowServiceTypes}
            handleSetScreen={handleSetScreen}
            setCurrentScreen={setCurrentScreen}/>
    );
};