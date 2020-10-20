import React from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button} from "@material-ui/core";
import {ScheduleCalendar} from "./ScheduleCalendar";

export const EmployeeSchedule = () => {
    const actions = <Button variant="outlined" color="primary">Filters</Button>
    return (
        <div style={{width: "100%"}}>
            <TitleContainer title="Employee Schedule" pad parent={optimizerRoot} actions={actions} />
            <ScheduleCalendar />
        </div>
    );
};