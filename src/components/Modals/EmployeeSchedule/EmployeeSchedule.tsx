import React from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {EmployeeScheduleCalendar} from "../../../features/EmployeeScheduleCalendar/EmployeeScheduleCalendar";
import {DialogProps} from "../types";

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