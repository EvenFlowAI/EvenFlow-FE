import React from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {ScheduleCalendar} from "../../Optimizer/EmployeeSchedule/ScheduleCalendar";
import {DialogProps} from "../types";

export const EmployeeSchedule: React.FC<DialogProps> = (props) => {
    return (
        <BaseModal {...props} width={1280}>
            <DialogTitle onClose={props.onClose}>Employee Schedule</DialogTitle>
            <DialogContent>
                <ScheduleCalendar />
            </DialogContent>
        </BaseModal>
    );
};