import React, {useEffect} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {IEmployeeRoleHours} from "../../../store/reducers/employees/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch} from "react-redux";
import {loadBaseEmployeeSchedule} from "../../../store/reducers/employees/actions";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {loadHoursOfOperations} from "../../../store/reducers/slotScoring/actions";

type TProps = DialogProps & {
    payload: IEmployeeRoleHours|null;
}

const EmployeeTimeScheduleSetUp: React.FC<TProps> = ({open, onClose, payload}) => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (payload && selectedSC) {
            dispatch(loadBaseEmployeeSchedule(selectedSC.id, payload.employeeId, payload.serviceBookId ?? undefined))
            dispatch(loadWorkingDays(selectedSC.id))
            dispatch(loadHoursOfOperations(selectedSC.id))
        }
    }, [selectedSC, payload])

    return (
        <BaseModal open={open} onClose={onClose}>
            <DialogTitle onClose={onClose}>Employee Time schedule Set Up</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>

            </DialogActions>
        </BaseModal>
    );
};

export default EmployeeTimeScheduleSetUp;