import React from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {EmployeeScheduleCalendar} from "../../../../features/admin/EmployeeScheduleCalendar/EmployeeScheduleCalendar";
import {DialogProps} from "../../BaseModal/types";

export const EmployeeSchedule: React.FC<DialogProps> = (props) => {
    return (
        <BaseModal {...props} width={1280}>
            <DialogTitle onClose={props.onClose}>Employee Schedule</DialogTitle>
            <DialogContent>
                <EmployeeScheduleCalendar />
            </DialogContent>
        </BaseModal>
    );
};