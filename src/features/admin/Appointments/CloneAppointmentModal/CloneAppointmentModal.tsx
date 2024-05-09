import React, {useEffect} from 'react';
import {BaseModal, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {EAppointmentTimingType, IAppointmentSlotsRequest} from "../../../../store/reducers/appointment/types";
import {RootState} from "../../../../store/rootReducer";
import dayjs from "dayjs";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {loadAppointmentSlots, loadServiceValetSlots} from "../../../../store/reducers/appointment/actions";
import {mapRecallsForRequest} from "../../../../utils/utils";

const CloneAppointmentModal: React.FC<DialogProps> = (props) => {
    const {currentAppointment} = useSelector((state: RootState) => state.appointments);
    const {selectedRecalls} = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        const utcOffset = dayjs().utcOffset()
        if (selectedSC && currentAppointment) {
            const data: IAppointmentSlotsRequest = {
                appointmentTimingType: EAppointmentTimingType.FirstAvailable,
                serviceCenterId: selectedSC.id,
                advisorId: currentAppointment.advisor?.id ?? null,
                fromDate:dayjs().startOf("day").add(utcOffset, 'minute').toISOString(),
                maintenancePackageOption: currentAppointment.maintenancePackageOption ?? null,
                serviceRequestIds: currentAppointment.serviceRequests.map(el => el.id),
                serviceCategoryIds: currentAppointment.serviceCategories.map(el => el.id),
                customerId: currentAppointment.customerId,
                serviceTypeOptionId: currentAppointment.serviceTypeOption?.id ?? null,
                recalls: mapRecallsForRequest(selectedRecalls),
            }
            if (currentAppointment.address?.zipCode) data.zipCode = currentAppointment.address?.zipCode;
            if (currentAppointment.address) {
                data.address = currentAppointment.address.fullAddress
            }
            if (currentAppointment.vehicle) {
                data.vehicle = {
                    vin: currentAppointment.vehicle.vin,
                    year: currentAppointment.vehicle.year,
                    make: currentAppointment.vehicle.make,
                    model: currentAppointment.vehicle.model,
                    mileage: currentAppointment.vehicle.mileage,
                    engineTypeId: currentAppointment.vehicle.engineTypeId,
                }
            }
            if (currentAppointment.hashKey) data.appointmentHashKey = currentAppointment.hashKey;
            if (currentAppointment.driver?.email) data.searchTerm = currentAppointment.driver?.email;
            if (currentAppointment.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                if (data.address && data.zipCode) dispatch(loadServiceValetSlots(data));
            } else {
                dispatch(loadAppointmentSlots(data));
            }
        }
    }, [selectedSC, currentAppointment])

    return <BaseModal {...props} width={1100}>
        <DialogTitle onClose={props.onClose}>Clone Appointment</DialogTitle>
    </BaseModal>
};

export default CloneAppointmentModal;