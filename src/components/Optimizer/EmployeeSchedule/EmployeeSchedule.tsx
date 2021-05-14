import React from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button} from "@material-ui/core";
import {ScheduleCalendar} from "./ScheduleCalendar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {switchScheduleFilters} from "../../../store/reducers/schedules/actions";

export const EmployeeSchedule = () => {
    const dispatch = useDispatch();
    const isOpened = useSelector((state: RootState) => state.employeesSchedule.filtersOpened);
    const toggleFilters = () => {
        dispatch(switchScheduleFilters(!isOpened));
    }
    const actions = <Button variant="outlined" color="primary" onClick={toggleFilters}>Filters</Button>
    return (
        <div style={{width: "100%"}}>
            <TitleContainer title="Employee Schedule" pad parent={optimizerRoot} actions={actions} />
            <ScheduleCalendar />
        </div>
    );
};