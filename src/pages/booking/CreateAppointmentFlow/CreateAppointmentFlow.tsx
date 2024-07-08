import React, {useMemo, useState} from 'react';
import {Cars} from "../../../features/booking/AppointmentFlow/Screens/Cars/Cars";
import {
    AppointmentConfirmation
} from '../../../features/booking/AppointmentFlow/Create/AppointmentConfirmation/AppointmentConfirmation';
import {
    AppointmentComment
} from "../../../features/booking/AppointmentFlow/Screens/AppointmentComment/AppointmentComment";
import {
    MaintenancePackages
} from "../../../features/booking/AppointmentFlow/Screens/MaintenancePackages/MaintenancePackages";
import {SelectOpsCode} from "../../../features/booking/AppointmentFlow/Screens/ServiceOpsCodes/SelectOpsCode";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    AppointmentConfirmed
} from "../../../features/booking/AppointmentFlow/Screens/AppointmentConfirmed/AppointmentConfirmed";
import {IServiceCategory} from "../../../api/types";
import '../../../features/booking/AppointmentFlow/AppointmentFlow.css';
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import PaymentScreen from "../../../features/booking/AppointmentFlow/Screens/PaymentScreen/PaymentScreen";
import OfferProductPage from "../../../features/booking/AppointmentFlow/Screens/OfferProductPage/OfferProductPage";
import {TScreen} from "../../../types/types";
import {
    ServiceNeedsCreate
} from "../../../features/booking/AppointmentFlow/Create/ServiceNeedsCreate/ServiceNeedsCreate";
import MaintenanceCreate from "../../../features/booking/AppointmentFlow/Create/MaintenanceCreate/MaintenanceCreate";
import ConsultantsCreate from "../../../features/booking/AppointmentFlow/Create/ConsultantsCreate/ConsultantsCreate";
import AppointmentTimingCreate
    from "../../../features/booking/AppointmentFlow/Create/AppointmentTimingCreate/AppointmentTimingCreate";
import AppointmentSlotsCreate
    from "../../../features/booking/AppointmentFlow/Create/AppointmentSlotsCreate/AppointmentSlotsCreate";
import TransportationsCreate
    from "../../../features/booking/AppointmentFlow/Create/TransportationsCreate/TransportationsCreate";
import YourLocationCreate from "../../../features/booking/AppointmentFlow/Create/YourLocationCreate/YourLocationCreate";
import AppointmentFlow from "../../../features/booking/AppointmentFlow/AppointmentFlow";
import {TFlowProps} from "../types";

export const CreateAppointmentFlow: React.FC<TFlowProps> = ({
                                                          handleChangeScreen,
                                                          onUpdateAppointment,
                                                          onSelectAppointment,
                                                          handleSetScreen,
                                                          handleLogin,
                                                          onGoToFirstScreen,
                                                          loadingCar,
                                                          currentScreen,
                                                          setCurrentScreen,
                                                          serviceCategoryPage,
                                                          setServiceCategoryPage,
                                                          needToShowServiceTypes,
                                                          setNeedToShowServiceTypes,
}) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory|null>(null);

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const component = useMemo(() => {
        const carSelections: {[k in TScreen]?: JSX.Element} = {
            carSelection: <Cars
                onBack={handleLogin}
                loading={loadingCar}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                needToShowServiceSelection={needToShowServiceTypes}
                handleSetScreen={handleSetScreen}
                onSelectAppointment={onSelectAppointment}/>,
            serviceNeeds: <ServiceNeedsCreate
                page={serviceCategoryPage}
                setPage={setServiceCategoryPage}
                setLastSelectedCategory={setLastSelectedCategory}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                onBack={handleChangeScreen(serviceType === EServiceType.VisitCenter ? 'carSelection' : 'location')}
                onSelect={handleSetScreen} />,
            maintenanceDetails: <MaintenanceCreate
                serviceCategoryPage={serviceCategoryPage}
                onBack={handleSetScreen}
                onNext={handleSetScreen}
            />,
            packageSelection: <MaintenancePackages
                isManagingFlow={false}
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            describeMore: <AppointmentComment
                handleSetScreen={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
                isManagingFlow={false}
            />,
            opsCode: <SelectOpsCode
                onAddServices={handleChangeScreen('serviceNeeds')}
                handleSetScreen={handleSetScreen}
                page={serviceCategoryPage}
                isManagingFlow={false}
            />,
            consultantSelection: <ConsultantsCreate
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : "appointmentSelection")}
            />,
            appointmentTiming: <AppointmentTimingCreate handleSetScreen={handleSetScreen}/>,
            appointmentSelection: <AppointmentSlotsCreate handleSetScreen={handleSetScreen}/>,
            transportationNeeds: <TransportationsCreate
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
            location: <YourLocationCreate
                onBack={handleChangeScreen('carSelection')}
                onNext={handleChangeScreen('serviceNeeds')}
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
        <AppointmentFlow
            handleLogin={handleLogin}
            currentScreen={currentScreen}
            component={component}
            setNeedToShowServiceTypes={setNeedToShowServiceTypes}
            handleSetScreen={handleSetScreen}
            setCurrentScreen={setCurrentScreen}/>
    );
};