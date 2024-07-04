import React from 'react';
import {MaintenanceDetailsForm} from "./MaintenanceDetailsForm";
import {TArgCallback, TScreen} from "../../../../types/types";
import {EServiceCategoryPage} from "../../../../api/types";
import {EServiceCategoryType} from "../../../../store/reducers/categories/types";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {checkPodChanged} from "../../../../store/reducers/appointments/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useException} from "../../../../hooks/useException/useException";

type TMaintenanceDetailsProps = {
    onBack: TArgCallback<TScreen>;
    onNext: TArgCallback<TScreen>;
    serviceCategoryPage: EServiceCategoryPage;
}

const MaintenanceManage:React.FC<TMaintenanceDetailsProps> = ({onBack, onNext, serviceCategoryPage}) => {
    const {isAdvisorAvailable, isAppointmentTimingAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {
        service,
        serviceTypeOption,
        appointmentByKey,
        advisor,
    }= useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);

    const dispatch = useDispatch();
    const showError = useException();

    const handleUpdating = () => {
        if (service?.type === EServiceCategoryType.MaintenancePackage) {
            onNext("packageSelection")
        } else {
            const advisorNotSelected = !advisor && isAdvisorAvailable;
            const pickUpSelected = serviceTypeOption?.type === EServiceType.PickUpDropOff
                && appointmentByKey?.serviceTypeOption
                && appointmentByKey?.serviceTypeOption?.type !== EServiceType.PickUpDropOff;
            const pickUpChanged = serviceTypeOption?.type !== EServiceType.PickUpDropOff
                && appointmentByKey?.serviceTypeOption
                && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff;
            if (pickUpSelected || pickUpChanged) {
                onNext(advisorNotSelected
                    ? "consultantSelection"
                    : isAppointmentTimingAvailable
                        ? "appointmentTiming"
                        : "appointmentSelection")
            } else {
                if (advisorNotSelected) {
                    onNext("consultantSelection");
                } else {
                    scProfile && dispatch(checkPodChanged(scProfile.id, showError))
                }
            }
        }
    }

    return <MaintenanceDetailsForm
        serviceCategoryPage={serviceCategoryPage}
        onBack={onBack}
        handleNext={handleUpdating}
    />;
};

export default MaintenanceManage;