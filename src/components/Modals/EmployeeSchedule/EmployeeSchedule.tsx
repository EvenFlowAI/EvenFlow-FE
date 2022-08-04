import React from 'react';
import {Button, styled} from "@material-ui/core";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {ScheduleCalendar} from "../../Optimizer/EmployeeSchedule/ScheduleCalendar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {switchScheduleFilters} from "../../../store/reducers/schedules/actions";
import {DialogProps} from "../types";

const ButtonWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 20,
})

export const EmployeeSchedule: React.FC<DialogProps> = (props) => {
    const dispatch = useDispatch();
    const isOpened = useSelector((state: RootState) => state.employeesSchedule.filtersOpened);
    const toggleFilters = () => {
        dispatch(switchScheduleFilters(!isOpened));
    }
    return (
        <BaseModal {...props} width={1280}>
            <DialogTitle onClose={props.onClose}>Employee Schedule</DialogTitle>
            <DialogContent>
                <ButtonWrapper>
                    <Button variant="outlined" color="primary" onClick={toggleFilters}>Filters</Button>
                </ButtonWrapper>
                <ScheduleCalendar />
            </DialogContent>
        </BaseModal>
    );
};