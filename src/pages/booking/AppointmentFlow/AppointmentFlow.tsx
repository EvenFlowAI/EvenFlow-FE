import React, {useCallback, useMemo, useState} from 'react';
import {Redirect, Route, Switch, useHistory, useParams} from "react-router-dom";
import {Routes} from "../../../routes/constants";
import {CreateAppointmentFlow} from "../CreateAppointmentFlow/CreateAppointmentFlow";
import {ManageAppointmentFlow} from "../ManageAppointmentFlow/ManageAppointmentFlow";
import {EServiceCategoryPage, IAppointmentByKey, ILoadedVehicle} from "../../../api/types";
import {clearCustomerCache, setCustomerLoadedData} from "../../../store/reducers/appointment/actions";
import {
    handleAppointmentUpdate,
    setCurrentFrameScreen, setServiceTypeOption, setWelcomeScreenView, updatePackageOption,
    updateRecalls
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TMobileScreen, TScreen, TView} from "../../../types/types";
import {encodeSCID} from "../../../utils/utils";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {setTransportationAvailable} from "../../../store/reducers/bookingFlowConfig/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException} from "../../../hooks/useException/useException";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";

const AppointmentFlow = () => {
    const {
        selectedVehicle,
        makes,
        serviceTypeOption,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {
        isTransportationAvailable,
        isAppointmentTimingAvailable,
        isAdvisorAvailable
    } = useSelector((state: RootState) => state.bookingFlowConfig);

    const [currentScreen, setCurrentScreen] = useState<TScreen | TMobileScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);
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

    const onUpdateAppointment = useCallback(async (car: ILoadedVehicle) => {
        dispatch(handleAppointmentUpdate(car, setLoadingCar, setServiceCategoryPage, isAuth, id, handleServiceTypeOption, showError))
    }, [handleSetScreen, showError, dispatch, firstScreenOptions, makes, scProfile,
        handleServiceTypeOption, needToShowServiceTypes, serviceTypeOption, id,
        updateRecalls, updatePackageOption, goToServiceTypeSelection,
        isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable,
        selectedVehicle, engineTypes, isAuth])

    const onSelectAppointment = async (car: ILoadedVehicle) => {
        customerLoadedData && dispatch(setCustomerLoadedData({...customerLoadedData, isUpdating: true}))
        await onUpdateAppointment(car)
        dispatch(setCurrentFrameScreen("manageAppointment"));
        history.push( "/f/appointment-manage/" + id);
    }

    return (
        <Switch>
            <Route path={Routes.EndUser.AppointmentFrame} exact render={() => <CreateAppointmentFlow
                onUpdateAppointment={onUpdateAppointment}
                onSelectAppointment={onSelectAppointment}
                handleLogin={handleLogin}
                handleSetScreen={handleSetScreen}
                onGoToFirstScreen={onGoToFirstScreen}
                loadingCar={loadingCar}
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
                serviceCategoryPage={serviceCategoryPage}
                setServiceCategoryPage={setServiceCategoryPage}
                needToShowServiceTypes={needToShowServiceTypes}
                setNeedToShowServiceTypes={setNeedToShowServiceTypes}
            />} />
            <Route path={Routes.EndUser.ManageAppointmentFrame} exact render={() => <ManageAppointmentFlow
                onUpdateAppointment={onUpdateAppointment}
                onSelectAppointment={onSelectAppointment}
                handleLogin={handleLogin}
                handleSetScreen={handleSetScreen}
                onGoToFirstScreen={onGoToFirstScreen}
                loadingCar={loadingCar}
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
                serviceCategoryPage={serviceCategoryPage}
                setServiceCategoryPage={setServiceCategoryPage}
                needToShowServiceTypes={needToShowServiceTypes}
                setNeedToShowServiceTypes={setNeedToShowServiceTypes}
            />} />
            <Redirect to={Routes.EndUser.Welcome}/>
        </Switch>
    );
};

export default AppointmentFlow;