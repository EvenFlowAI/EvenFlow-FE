import React, {useMemo} from 'react';
import {MaintenanceDetailsForm} from "../../Screens/MaintenanceDetails/MaintenanceDetailsForm";
import {TArgCallback, TScreen} from "../../../../../types/types";
import {EServiceCategoryPage} from "../../../../../api/types";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";

type TMaintenanceDetailsProps = {
    onBack: TArgCallback<TScreen>;
    onNext: TArgCallback<TScreen>;
    serviceCategoryPage: EServiceCategoryPage;
}

const MaintenanceCreate:React.FC<TMaintenanceDetailsProps> = ({onBack, onNext, serviceCategoryPage}) => {
    const {isAdvisorAvailable, isAppointmentTimingAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {service} = useSelector((state: RootState) => state.appointmentFrame);

    const nextLogicalScreen = useMemo(() => {
        return isAdvisorAvailable
            ? 'consultantSelection'
            : isAppointmentTimingAvailable
                ? 'appointmentTiming'
                : "appointmentSelection"
    }, [isAdvisorAvailable, isAppointmentTimingAvailable])

    const goToNextScreen = () => {
        onNext(service?.type === EServiceCategoryType.MaintenancePackage
            ? 'packageSelection'
            : nextLogicalScreen);
    }

    return <MaintenanceDetailsForm
        serviceCategoryPage={serviceCategoryPage}
        onBack={onBack}
        handleNext={goToNextScreen}
    />;
};

export default MaintenanceCreate;